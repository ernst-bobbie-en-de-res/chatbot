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
  min-height: 350px;
  max-height: 650px !important;
  display:block;
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

let figmaComponentsCache;

const ConfigureFigma = (props) => {
  const [figmaComponents, setFigmaComponents] = React.useState([]);

  React.useEffect(async () => {
    if (!figmaComponentsCache) {
      const { data } = await Axios.get(`${API_URL}/images/components`);
      figmaComponentsCache = data;
    }
    setFigmaComponents(Object.keys(figmaComponentsCache).map(key => { return { [key]: figmaComponentsCache[key] } }));
  });

  return <Select
    value={props.answer}
    onChange={e => props.setAnswer(e.target.value)}
    onClick={stopPropagation}
    onMouseUp={stopPropagation}
    onMouseDown={stopPropagation}
    onKeyDown={stopPropagation}
  >
    <option disabled value=''>Selecteer een Figma component..</option>
    {figmaComponents.map((x, i) => <option value={Object.keys(x)[0]} key={i}>{Object.values(x)[0]['name']}</option>)}
  </Select>
}

const ConfigureText = (props) => {
  return <Input
    type="text"
    placeholder="Vul hier het antwoord op de bovenstaande vragen in.."
    value={props.answer}
    onChange={(e) => props.setAnswer(e.target.value)}
    onClick={stopPropagation}
    onMouseUp={stopPropagation}
    onMouseDown={stopPropagation}
    onKeyDown={stopPropagation}
  />
}

const types = {
  figma: {
    component: ConfigureFigma
  },
  text: {
    component: ConfigureText
  },
  maps: {
    component: ConfigureText
  },
  youtube: {
    component: ConfigureText
  },
  html: {
    component: ConfigureText
  }
}

const NodeInnerCustom = (props) => {
  const [type, setType] = React.useState(props.node.properties.type || 'text');
  const setTypeWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.type = value;
    setType(value);
  };

  const [componentType, setComponentType] = React.useState(props.node.properties.componentType || 'informational');
  const setComponentTypeWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.componentType = value;
    setComponentType(value);
  };

  const [forContextVariable, setForContextVariable] = React.useState(props.node.properties.forContextVariable || '');
  const setForContextVariableWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.forContextVariable = value;
    setForContextVariable(value);
  };

  const [contextAnswerType, setContextAnswerType] = React.useState(props.node.properties.contextAnswerType || 'text');
  const setContextAnswerTypeWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.contextAnswerType = value;
    setContextAnswerType(value);
  };

  const RenderComponent = types[type].component;

  const [answer, setAnswer] = React.useState(props.node.properties.answer || '');
  const setAnswerWrapper = (value) => {
    chartHack.selected = {};
    props.node.properties.answer = value;
    setAnswer(value);
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
            onKeyDown={stopPropagation}
            onMouseDown={stopPropagation}
          />
        </InputWrapper>
      })}
      <button
        onClick={addPattern}
        onKeyDown={stopPropagation}
        onMouseDown={stopPropagation}
      >+</button>

      <br /><br /><br />
      <Header>Antwoord</Header>
      <InputWrapper>
        <Select
          value={type}
          onChange={e => setTypeWrapper(e.target.value)}
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          {Object.keys(types).map(type => <option key={type} value={type}>{type}</option>)}
        </Select>
      </InputWrapper>

      <hr />

      <InputWrapper>
        <RenderComponent setAnswer={setAnswerWrapper} answer={answer}></RenderComponent>
      </InputWrapper>

      <br /><hr />
      <Header>Context</Header>
      <InputWrapper>
        <Select
          value={componentType}
          onChange={e => setComponentTypeWrapper(e.target.value)}
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          <option value="informational">informational</option>
          <option value="contextual">contextual</option>
        </Select>
      </InputWrapper>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Context variabele naam"
          value={forContextVariable}
          onChange={e => setForContextVariableWrapper(e.target.value)}
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
          onMouseDown={stopPropagation}
        />
      </InputWrapper>
      <br />
      <Header>Context antwoord</Header>
      <InputWrapper>
        <Select
          value={contextAnswerType}
          onChange={e => setContextAnswerTypeWrapper(e.target.value)}
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          {Object.keys(types).map(type => <option key={type} value={type}>{type}</option>)}
        </Select>
      </InputWrapper>
    </Outer>
  )

}


export const DragAndDropSidebar = () => {
  const [chart, setChart] = React.useState(null);

  chartHack = chart;

  React.useEffect(async () => {
    const { data } = await Axios.get(`${API_URL}/state`);
    setChart(data || cloneDeep(chartSimple));
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
          NodeInner: props => <NodeInnerCustom {...props}></NodeInnerCustom>,
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