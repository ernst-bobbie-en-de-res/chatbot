export const mapChartState = (chartState) => Object.values(chartState.nodes).map((node) => ({
    id: node.id,
    text: node.properties.text,
    patterns: node.properties.patterns,
    website: node.properties.website,
    subNodes: Object.values(chartState.links)
        .filter(link => link.from.nodeId === node.id)
        .map(link => ({
            to: link.to.nodeId
        }))
}));

