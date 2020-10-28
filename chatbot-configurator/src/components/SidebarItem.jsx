import * as React from 'react'
import styled from 'styled-components'

const Outer = styled.div`
  padding: 20px 30px;
  font-size: 14px;
  background: white;
  cursor: move;
`
export const SidebarItem = ({ type, ports, properties }) => {
  return (
    <Outer
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData('react-flow-chart', JSON.stringify({ type, ports, properties }))
      } }
    >
      {type}
    </Outer>
  )
}
