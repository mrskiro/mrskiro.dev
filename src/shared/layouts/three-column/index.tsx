import { PropsWithChildren, ReactNode } from "react"
import { Switcher } from "@/shared/features/theme/components/switcher"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import * as S from "../styled"

type Props = {
  renderRight: () => ReactNode
}

export const ThreeColumn = (props: PropsWithChildren<Props>) => (
  <S.Wrap>
    <S.SwitcherWrap>
      <Switcher />
    </S.SwitcherWrap>
    <S.ThreeColumn>
      <S.LeftMenu>
        <Header />
      </S.LeftMenu>

      <S.Main>{props.children}</S.Main>
      <S.RightMenu>{props.renderRight()}</S.RightMenu>
    </S.ThreeColumn>
    <S.Hr />
    <Footer />
  </S.Wrap>
)