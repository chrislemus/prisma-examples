import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Number(req.query.id)

  switch (req.method) {
    case 'GET':
      return getProfile(userId, res)
    case 'POST':
      return createProfile(userId, req, res)
    case 'PATCH':
      return updateProfile(userId, req, res)

    default:
      res
        .status(404)
        .send(`The HTTP ${req.method} method is not supported at this route.`)
      break
  }
}

async function getProfile(userId: number, res: NextApiResponse<any>) {
  const profile = await prisma.profile.findUnique({ where: { userId } })
  return res.json(profile)
}

async function createProfile(
  userId: number,
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { bio } = JSON.parse(req.body)
  const profile = await prisma.profile.create({
    data: { bio, user: { connect: { id: userId } } },
  })
  return res.json(profile)
}

async function updateProfile(
  userId: number,
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { bio } = JSON.parse(req.body)
  const profile = await prisma.profile.update({
    data: { bio },
    where: { userId },
  })
  return res.json(profile)
}
