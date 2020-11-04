import * as React from 'react'
import styled from 'styled-components'
import { actions, FlowChart, FlowChartWithState } from "@mrblenny/react-flow-chart";
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

const Input = styled.input`
    border: solid #EEE 2px;
    border-radius: 5px;
    padding: 5px;
 `

const InputWrapper = styled.div`
  margin:5px 0;
`

const InputLabel = styled.label`
`

const SaveButton = styled.button`
  position: absolute;
  z-index: 9;
  background: #6395ed;
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
`
let chartHack = {}

const stopPropagation = (e) => {
  e.stopPropagation();
  chartHack.selected = {};
}

const NodeInnerCustom = (props) => {
  const [text, setText] = React.useState(props.node.properties.text)
  const setTextWrapper = (value) => {
    props.node.properties.text = value;
    setText(value)
  }

  const [website, setWebsite] = React.useState(props.node.properties.website)
  const setWebsiteWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.website = value;
    setWebsite(value)
  }

  const [patterns, setPatterns] = React.useState(props.node.properties.patterns || [""])
  const setPatternsWrapper = (patterns) => {
    chartHack.selected = {};
    props.node.properties.patterns = patterns;
    setPatterns(patterns)
  }

  const addPattern = () => {
    setPatternsWrapper([...patterns, ""])
  }

  return (
    <Outer>
      <div>Vragen</div>

      {patterns.map((pattern, index, array) => {

        const setValue = (value) => {
          array[index] = value;
          setPatternsWrapper([...array]);
        }

        return <InputWrapper>
          <InputLabel>Vraag: </InputLabel>
          <Input
            type="text"
            value={pattern}
            onChange={(e) => {setValue(e.target.value);}}
            onClick={stopPropagation}
            onMouseUp={stopPropagation}
            onMouseDown={stopPropagation}
          />
        </InputWrapper>
      })}

      <button onClick={addPattern}>+</button>

      <br /><br />

      <div>Antwoord</div>
      <InputWrapper>
        <InputLabel>Text: </InputLabel>
        <Input
          type="text"
          value={text}
          onChange={(e) => setTextWrapper(e.target.value)}
          onClick={stopPropagation}
          onMouseUp={stopPropagation}
          onMouseDown={stopPropagation}
        />
      </InputWrapper>

      {/* <InputWrapper>
        <InputLabel>Website: </InputLabel>
        <Input
          type="text"
          value={website}
          onChange={(e) => setWebsiteWrapper(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </InputWrapper> */}

    </Outer>
  )

}


export const DragAndDropSidebar = () => {
  const [chart, setChart] = React.useState(null);

  chartHack = chart;

  React.useEffect(async () => {

    const { data } = await Axios.get('http://localhost:5000/state');

    setChart(data || cloneDeep(chartSimple));


  }, []);

  if (chart === null) {
    return <>Laden..</>;
  }

  const saveState = async () => {
    await Axios.post('http://localhost:5000/state', chart);
    await Axios.post('http://localhost:5000/nodes', mapChartState(chart));
    await Axios.get('http://localhost:5000/train');

    alert("Opgeslagen!")
  }

  const stateActions = mapValues(actions, (func) =>
    (...args) => {
      console.log('change')
      setChart(cloneDeep(func(...args)(chart)))
    }
  )

  return < Page >
    <SaveButton onClick={saveState}>Save</SaveButton>
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
        Sleep de volgende items naar het canvas.
      </Message>
      <SidebarItem
        type="Vraag/antwoord blok"
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