'use server'

import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'

const client = new PrismaClient()

export async function saveLink(link: string, shortened_link: string, id: string) {
  const saved = await client.link.create({
    data: {
      id,
      link,
      shortened_link
    }
  })

  return saved
}

export async function getLink(id: string) {
  const result = await client.link.findFirst({
    where: {
      id
    }
  })

  if (!result?.link) {
    return redirect('/')
  }

  return result.link
}