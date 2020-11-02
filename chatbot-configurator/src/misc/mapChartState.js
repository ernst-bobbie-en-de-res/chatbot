export const mapChartState = (chartState) => {


    console.log(Object.values(chartState.nodes))

    return Object.values(chartState.nodes).map((node) => ({
        id: node.id,
        text: node.properties.custom,
        subNodes: Object.values(chartState.links)
            .filter(link => link.from.nodeId === node.id)
            .map(link => ({
                to: link.to.nodeId
            }))
    }));

}