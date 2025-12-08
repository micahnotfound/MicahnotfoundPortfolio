import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/lib/content'

export async function GET() {
  try {
    const project = getProjectBySlug('dreaming-with-the-archives')

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 })
  }
}
