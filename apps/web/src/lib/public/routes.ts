import { getToolPageKeys } from '../tools/tool-pages';
import { guides } from './guides';

export const publicPages = ['/', '/tools', '/test-prep', '/practice', '/admissions', '/resources', '/guides', '/pricing', '/about', '/contact', '/help', '/privacy', '/terms', '/cookies', '/accessibility'];
export function publicToolPaths() {
  return [...new Set([...getToolPageKeys().map(key => `/tools/${key}`), '/tools/test-prep/act-score-calculator', '/tools/study/study-time-planner', '/tools/admissions/application-checklist'])];
}
export function publicRoutes() {
  const tools = publicToolPaths();
  const categories = [...new Set(tools.map(path => path.split('/').slice(0,3).join('/')))];
  return [...new Set([...publicPages, ...categories, ...tools, ...guides.map(g => `/guides/${g.slug}`)])];
}
