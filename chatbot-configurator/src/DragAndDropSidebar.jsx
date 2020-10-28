import * as React from 'react'
import styled from 'styled-components'
import { actions, FlowChart, FlowChartWithState } from "@mrblenny/react-flow-chart";
// import { Content, Page, Sidebar, SidebarItem } from './components'
import { chartSimple } from './misc/exampleChartState'
import { Page } from './components/Page';
import { Content } from './components/Content';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import mapValues from '@mrblenny/react-flow-chart/src/container/utils/mapValues';
import { cloneDeep } from 'lodash';

const Message = styled.div`
margin: 10px;
padding: 10px;
background: rgba(0,0,0,0.05);
`
const Outer = styled.div`
  padding: 30px;
`

const NodeInnerCustom = ({ node, config }) => {

  return (
    <Outer>
      <input
        type="text"
        placeholder="Text"
        onChange={(e) => console.log(e)}
        onClick={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </Outer>
  )

}

export const DragAndDropSidebar = () => {
  const [chart, setChart] = React.useState(cloneDeep(chartSimple));

  const stateActions = mapValues(actions, (func) =>
    (...args) => {
      setChart(cloneDeep(func(...args)(chart)))
    }
  )

  console.log(chart);

  return < Page >
    <Content>
      <FlowChart
        chart={chart}
        callbacks={stateActions}
        Components={{
          NodeInner: NodeInnerCustom,
        }} />
    </Content>
    <Sidebar>
      <Message>
        Drag and drop these items onto the canvas.
      </Message>
      <SidebarItem
        type="Text node"
        ports={{
          port1: {
            id: 'port1',
            type: 'top',
            properties: {
              custom: 'property',
            },
          },
          port2: {
            id: 'port2',
            type: 'bottom',
            properties: {
              custom: 'property',
            },
          },
        }}
        properties={{
          custom: 'property',
        }}
      />

    </Sidebar>
  </Page >

}