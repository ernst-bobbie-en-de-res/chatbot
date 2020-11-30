export const mapChartState = (chartState) => Object.values(chartState.nodes).map((node) => ({
    id: node.id,
    answer: node.properties.answer,
    type: node.properties.type,
    patterns: node.properties.patterns,
    subNodes: Object.values(chartState.links)
        .filter(link => link.from.nodeId === node.id)
        .map(link => ({
            to: link.to.nodeId
        }))
}));

