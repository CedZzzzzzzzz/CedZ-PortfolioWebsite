import type { Project } from '../types/content'

export function resolveProjectImage(
  project: Pick<Project, 'n' | 'img'>,
  uploaded?: string,
): string {
  if (uploaded) return uploaded
  if (project.img) return project.img
  const name = project.n
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650">' +
    '<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#102039"/><stop offset="1" stop-color="#405879"/></linearGradient></defs>' +
    '<rect width="1000" height="650" fill="url(#bg)"/>' +
    '<circle cx="760" cy="220" r="170" fill="none" stroke="#a9c3e8" stroke-width="2" opacity=".3"/>' +
    '<text x="60" y="530" fill="#fff" font-family="monospace" font-size="42">' +
    name +
    '</text>' +
    '<text x="60" y="580" fill="#c6d6ec" font-family="monospace" font-size="20">project preview</text></svg>'
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
