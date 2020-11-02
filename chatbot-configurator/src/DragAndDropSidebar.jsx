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
import { mapChartState } from './misc/mapChartState';
import Axios from 'axios';

const Message = styled.div`
margin: 10px;
padding: 10px;
background: rgba(0,0,0,0.05);
`
const Outer = styled.div`
  padding: 30px;
`

const NodeInnerCustom = (props) => {

  const [text, setText] = React.useState(props.node.properties.text)
  const setTextWrapper = (value) => {
    props.node.properties.text = value;
    setText(value)
  }

  const [website, setWebsite] = React.useState(props.node.properties.website)
  const setWebsiteWrapper = (value) => {
    props.node.properties.website = value;
    setWebsite(value)
  }

  return (
    <Outer>
      <div>
        Text:
        <input
          type="text"
          value={text}
          onChange={(e) => setTextWrapper(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

      <div>
        Website:
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsiteWrapper(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

    </Outer>
  )

}

export const DragAndDropSidebar = () => {
  const [chart, setChart] = React.useState(null);

  React.useEffect(async () => {

    const { data } = await Axios.get('http://localhost:5000/api/v1/state');

    setChart(data || cloneDeep(chartSimple));


  }, []);

  if (chart === null) {
    return <>Laden..</>;
  }

  const saveState = async () => {
    await Axios.post('http://localhost:5000/api/v1/state', chart);
  }

  const stateActions = mapValues(actions, (func) =>
    (...args) => {
      console.log('change')
      setChart(cloneDeep(func(...args)(chart)))
    }
  )

  return < Page >
    <button onClick={saveState}>Save</button>
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