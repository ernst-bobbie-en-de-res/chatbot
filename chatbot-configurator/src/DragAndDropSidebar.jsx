import * as React from 'react'
import styled from 'styled-components'
import { FlowChartWithState } from "@mrblenny/react-flow-chart";
// import { Content, Page, Sidebar, SidebarItem } from './components'
import { chartSimple } from './misc/exampleChartState'
import { Page } from './components/Page';
import { Content } from './components/Content';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';

const Message = styled.div`
margin: 10px;
padding: 10px;
background: rgba(0,0,0,0.05);
`

export const DragAndDropSidebar = () => (
  <Page>
    <Content>
      <FlowChartWithState initialValue={chartSimple} />
    </Content>
    <Sidebar>
      <Message>
        Drag and drop these items onto the canvas.
      </Message>
      <SidebarItem
        type="top/bottom"
        ports={ {
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
        } }
        properties={ {
          custom: 'property',
        }}
      />

    </Sidebar>
  </Page>
)