import React from 'react'
import styled from '../../lib/styled'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import ButtonLink from '../atoms/ButtonLink'
import { useEffectOnce } from 'react-use'
import Container from '../atoms/Container'
import HomeLogoLink from '../atoms/HomeLogoLink'
import {
  layout,
  LayoutProps,
  space,
  SpaceProps,
  flex,
  FlexProps,
} from 'styled-system'
import Icon from '../atoms/Icon'
import { mdiDownload, mdiOpenInApp, mdiChevronDown } from '@mdi/js'
import { sendGAEvent, queueNavigateToGA } from '../../lib/analytics'

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
`

const HeaderNavigator = styled.nav<SpaceProps>`
  ${space}
  display: flex;
  align-items: center;
`
const HeaderLogo = styled.div<FlexProps>`
  ${flex}
`

const HeaderLeftList = styled.ul<LayoutProps>`
  ${layout}
  flex: 1;
  align-items: center;
`

const HeaderLink = styled.a<SpaceProps>`
  display: inline-block;
  position: relative;
  ${space}
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.black} !important;
  font-weight: bold;

  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: ${({ theme }) => theme.space[1]}px;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.teal};
  }
  &:before {
    left: ${({ theme }) => theme.space[2]}px;
    -webkit-transition: width 0s ease;
    transition: width 0s ease;
  }
  &:after {
    right: ${({ theme }) => theme.space[2]}px;
    -webkit-transition: width 0.3s ease;
    transition: width 0.3s ease;
  }

  &:hover {
    &:before,
    &:after {
      width: calc(100% - ${({ theme }) => theme.space[2]}px * 2);
    }
    &:before {
      -webkit-transition: width 0.3s ease;
      transition: width 0.3s ease;
    }
    &:after {
      -webkit-transition: all 0s 0.3s ease;
      transition: all 0s 0.3s ease;
    }
  }
`

const HeaderDropdown = styled.div`
  position: relative;

  &:hover {
    cursor: pointer;

    ul {
      display: block;
    }
  }

  span {
    display: inline-block;
    line-height: 45px;
    font-weight: bold;

    svg {
      margin-left: ${({ theme }) => theme.space[1]}px;
      vertical-align: middle;
    }
  }

  ul {
    display: none;
    position: absolute;
    top: 40px;
    z-index: 1;
    width: 150px;
    background-color: #fff;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.16);
    border-radius: 3px;
  }

  a {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.space[1]}px
      ${({ theme }) => theme.space[2]}px;
    color: ${({ theme }) => theme.colors.black} !important;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  img {
    margin-right: ${({ theme }) => theme.space[1]}px;
    height: 21px;
  }
`

const HeaderRightList = styled.ul<LayoutProps>`
  ${layout}
  list-style: none;
  align-items: center;

  li {
    margin: 0 0.5em;
  }
`

const HeaderLanguageSelect = styled.select`
  height: 50px;
  width: 50px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  font-size: 24px;
  line-height: 50px;

  &:hover {
    cursor: pointer;
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

const Header = () => {
  const { t, i18n } = useTranslation()

  useEffectOnce(() => {
    const language = localStorage.getItem('language')
    if (language != null) {
      i18n.changeLanguage(language)
    }
  })

  const switchLanguage = useCallback(
    (event) => {
      const language = event.target.value
      i18n.changeLanguage(language)
      localStorage.setItem('language', language)
    },
    [i18n]
  )

  return (
    <>
      <HeaderContainer>
        <Container>
          <HeaderNavigator mx={2} py={2}>
            <HeaderLogo flex={[1, 'inherit']}>
              <HomeLogoLink />
            </HeaderLogo>
            <HeaderLeftList display={['none', 'flex']}>
              <HeaderLink p={2} mx={3} href='https://boosthub.io'>
                {t('header.forTeams')}
              </HeaderLink>
              <HeaderDropdown>
                <span>
                  {t('header.community')}
                  <Icon path={mdiChevronDown} />
                </span>
                <ul>
                  <li>
                    <a
                      href='https://github.com/BoostIO/Boostnote.next'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/github.svg' />
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://join.slack.com/t/boostnote-group/shared_invite/zt-cun7pas3-WwkaezxHBB1lCbUHrwQLXw'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/slack.svg' />
                      Slack
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://issuehunt.io/r/BoostIo/Boostnote.next'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/issuehunt.svg' />
                      IssueHunt
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://twitter.com/boostnoteapp'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/twitter.svg' />
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://www.facebook.com/groups/boostnote/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/facebook.svg' />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://www.reddit.com/r/Boostnote/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src='/static/community-logos/reddit.svg' />
                      Reddit
                    </a>
                  </li>
                </ul>
              </HeaderDropdown>
            </HeaderLeftList>
            <HeaderRightList display={['none', 'none', 'none', 'flex']}>
              <li>
                <ButtonLink
                  bg='teal'
                  color='white'
                  fontSize={1}
                  py={2}
                  href='/#download'
                >
                  <Icon path={mdiDownload} />
                  {t('common.downloadApp')}
                </ButtonLink>
              </li>
              <li>
                <ButtonLink
                  bg='white'
                  color='teal'
                  fontSize={1}
                  py={2}
                  href='https://note.boostio.co/app'
                  onClick={(event) => {
                    event.preventDefault()
                    sendGAEvent('open-in-browser')
                    queueNavigateToGA('https://note.boostio.co/app')
                  }}
                >
                  <Icon path={mdiOpenInApp} /> {t('common.openInBrowser')}
                </ButtonLink>
              </li>
            </HeaderRightList>
            <HeaderLanguageSelect
              value={i18n.language}
              onChange={switchLanguage}
            >
              <option value='de'>🇩🇪</option>
              <option value='en'>🇺🇸</option>
              <option value='es'>🇪🇸</option>
              <option value='fr'>🇫🇷</option>
              <option value='ja'>🇯🇵</option>
              <option value='ko'>🇰🇷</option>
              <option value='nl'>🇳🇱</option>
              <option value='pt'>🇵🇹</option>
              <option value='ptBR'>🇧🇷</option>
              <option value='ru'>🇷🇺</option>
              <option value='vn'>🇻🇳</option>
              <option value='zh'>🇨🇳</option>
              <option value='hr'>🇭🇷</option>
              <option value='tr'>🇹🇷</option>
            </HeaderLanguageSelect>
          </HeaderNavigator>
        </Container>
      </HeaderContainer>
    </>
  )
}

export default Header
