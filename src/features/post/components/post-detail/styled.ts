import styled from "styled-components"

export const Wrap = styled.article`
  line-height: 1.9;
`

export const MetaWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const MetaDetailWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSizes["3xl"]};
  font-weight: bold;
`
export const DateLabel = styled.p`
  text-align: right;
  font-size: ${(props) => props.theme.fontSizes.xs};
`
