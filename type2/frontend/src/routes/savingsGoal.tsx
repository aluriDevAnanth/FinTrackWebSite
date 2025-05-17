import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/savingsGoal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/savingsGoal"!</div>
}
