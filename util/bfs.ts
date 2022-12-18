const bfs = (
    graph: Record<string, { name: string, to: string[], paths: undefined | Record<string, number>}>,
    root: { name: string, to: string[], paths: undefined | Record<string, number> }
) => {
    root.paths = {}
    const queue = []
    const visited = new Set()
    visited.add(root.name)
    queue.push(root)
    while (queue.length > 0) {
        const current = queue.shift()
        if (!current) throw new Error("should not!")
        for (const nei of graph[current.name].to) {
            if (!visited.has(nei)) {
                visited.add(nei)
                root.paths[nei] = root.paths[current.name] ? root.paths[current.name] + 1 : 1;
                queue.push(graph[nei])
            }
        }
    }
}

export default bfs