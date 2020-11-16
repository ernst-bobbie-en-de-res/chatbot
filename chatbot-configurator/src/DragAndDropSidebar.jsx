import * as React from 'react'
import styled from 'styled-components'
import { actions, FlowChart } from "@mrblenny/react-flow-chart";
import { chartSimple } from './misc/exampleChartState'
import { Page } from './components/Page';
import { Content } from './components/Content';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import mapValues from '@mrblenny/react-flow-chart/src/container/utils/mapValues';
import { cloneDeep } from 'lodash';
import { mapChartState } from './misc/mapChartState';
import Axios from 'axios';
import { API_URL } from './Constants';

const Message = styled.div`
margin: 10px;
padding: 10px;
background: rgba(0,0,0,0.05);
`
const Outer = styled.div`
  padding: 30px;
  text-align: left;
  min-width: 500px;
`

const Header = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`

const Input = styled.input`
    border: solid #EEE 2px;
    border-radius: 5px;
    padding: 5px;
    width: 100%;  
 `

const InputWrapper = styled.div`
    width: 100%;  
    margin: 5px 0;
`

const Select = styled.select`
    border: solid #EEE 2px;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
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
  const [text, setText] = React.useState(props.node.properties.text);
  const setTextWrapper = (value) => {
    props.node.properties.text = value;
    setText(value);
  };

  const [figmaComponent, setFigmaComponent] = React.useState(props.node.properties.figmaComponent || '');
  const setFigmaComponentWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.figmaComponent = value;
    setFigmaComponent(value);
  };

  const [patterns, setPatterns] = React.useState(props.node.properties.patterns || [""]);
  const setPatternsWrapper = (patterns) => {
    chartHack.selected = {};
    props.node.properties.patterns = patterns;
    setPatterns(patterns);
  };

  const addPattern = () => {
    setPatternsWrapper([...patterns, ""]);
  };

  return (
    <Outer>
      <Header>Vragen</Header>
      <hr />
      {patterns.map((pattern, index, array) => {
        const setValue = (value) => {
          array[index] = value;
          setPatternsWrapper([...array]);
        }
        return <InputWrapper key={index}>
          <Input
            type="text"
            placeholder="Vul een vraag in.."
            value={pattern}
            onChange={(e) => { setValue(e.target.value); }}
            onClick={stopPropagation}
            onMouseUp={stopPropagation}
            onMouseDown={stopPropagation}
          />
        </InputWrapper>
      })}
      <button onClick={addPattern}>+</button>

      <br /><br /><br />
      <Header>Antwoord</Header>
      <hr />
      <InputWrapper>
        <Input
          type="text"
          placeholder="Vul hier het antwoord op de bovenstaande vragen in.."
          value={text}
          onChange={(e) => setTextWrapper(e.target.value)}
          onClick={stopPropagation}
          onMouseUp={stopPropagation}
          onMouseDown={stopPropagation}
        />
      </InputWrapper>
      <InputWrapper>
        <Select
          value={figmaComponent}
          onChange={e => setFigmaComponentWrapper(e.target.value)}
          onClick={stopPropagation}
          onMouseUp={stopPropagation}
          onMouseDown={stopPropagation}
        >
          <option disabled value=''>Selecteer een Figma component..</option>
          {props.figmaComponents !== null && props.figmaComponents !== undefined
            ? props.figmaComponents.map((x, i) => <option value={Object.keys(x)[0]} key={i}>{Object.values(x)[0]['name']}</option>)
            : null
          }
        </Select>
      </InputWrapper>
    </Outer>
  )

}


export const DragAndDropSidebar = () => {
  const [chart, setChart] = React.useState(null);
  const [figmaComponents, setFigmaComponents] = React.useState(null);

  chartHack = chart;

  React.useEffect(async () => {
    const { data } = await Axios.get(`${API_URL}/state`);
    setChart(data || cloneDeep(chartSimple));

    const components = await Axios.get(`${API_URL}/images/components`);
    setFigmaComponents(Object.keys(components.data).map(key => { return { [key]: components.data[key] } }));
  }, []);

  if (chart === null) {
    return <>Laden..</>;
  }

  const saveState = async () => {
    await Axios.post(`${API_URL}/state`, chart);
    await Axios.post(`${API_URL}/nodes`, mapChartState(chart));
    await Axios.get(`${API_URL}/train`);

    alert("Opgeslagen!")
  }

  const stateActions = mapValues(actions, (func) =>
    (...args) => {
      setChart(cloneDeep(func(...args)(chart)))
    }
  )

  return <Page>
    <SaveButton onClick={saveState}>Save</SaveButton>
    <Content>
      <FlowChart
        chart={chart}
        callbacks={stateActions}
        Components={{
          NodeInner: props => <NodeInnerCustom {...props} figmaComponents={figmaComponents}></NodeInnerCustom>,
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
  </Page>
}