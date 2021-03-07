import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { getOSName, OSName } from '../../lib/platform'
import Container from '../atoms/Container'
import { useTranslation } from 'react-i18next'
import Box from '../atoms/Box'
import FlexBox from '../atoms/FlexBox'
import styled from '../../lib/styled'
import {
  typography,
  TypographyProps,
  ColorProps,
  color,
  space,
  SpaceProps,
} from 'styled-system'
import ButtonLink from '../atoms/ButtonLink'
import {
  macDmgDownloadUrl,
  macZipDownloadUrl,
  windowsAppIntallerUrl,
  linuxAppImageDownloadUrl,
  linuxDebDownloadUrl,
  androidPlayStoreUrl,
  iOSAppStoreUrl,
} from '../../lib/download'
import Icon from '../atoms/Icon'
import { mdiDownload, mdiOpenInApp } from '@mdi/js'
import DownloadButtonLink from '../atoms/DownloadButtonLink'
import { sendGAEvent, queueNavigateToGA } from '../../lib/analytics'
import Text from '../atoms/Text'
import SubscribeNewsLettersForm from './SubscribeNewsLettersForm'

const HeroTitle = styled.h1<TypographyProps>`
  ${typography}
`

const HeroSubTitle = styled.h2<TypographyProps | ColorProps>`
  ${typography}
  ${color}
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
`

const DownloadButtonLinksFragment = () => {
  const { t } = useTranslation()

  const [osName, setOSName] = useState<OSName | null>(null)

  useEffectOnce(() => {
    setOSName(getOSName())
  })

  switch (osName) {
    case 'mac':
      return (
        <>
          <DownloadButtonLink
            href={macDmgDownloadUrl}
            gaEventName='download-mac'
          >
            <Icon path={mdiDownload} />
            .dmg (macOS)
          </DownloadButtonLink>
          <DownloadButtonLink
            href={macZipDownloadUrl}
            gaEventName='download-mac'
          >
            <Icon path={mdiDownload} /> .zip (macOS)
          </DownloadButtonLink>
        </>
      )
    case 'win':
      return (
        <>
          <DownloadButtonLink
            href={windowsAppIntallerUrl}
            gaEventName='download-win'
          >
            <Icon path={mdiDownload} /> .exe (NSIS installer) (Windows)
          </DownloadButtonLink>
        </>
      )
    case 'linux':
      return (
        <>
          <DownloadButtonLink
            href={linuxAppImageDownloadUrl}
            gaEventName='download-linux'
          >
            <Icon path={mdiDownload} /> .AppImage (Linux)
          </DownloadButtonLink>
          <DownloadButtonLink
            href={linuxDebDownloadUrl}
            gaEventName='download-linux'
          >
            <Icon path={mdiDownload} /> .deb (Linux)
          </DownloadButtonLink>
        </>
      )
    case 'android':
    case 'ios':
      return null
    default:
      return (
        <ButtonLink bg='teal' color='white' href='/#download'>
          <Icon path={mdiDownload} /> {t('common.downloadApp')}
        </ButtonLink>
      )
  }
}

const MobileAppLink = styled.a<SpaceProps>`
  ${space}
  &:hover {
    cursor: pointer;
    transform: translateY(-3px);
    transition: 0.2s cubic-bezier(0, 0, 0.25, 1);
  }

  @media only screen and (min-width: 768px) {
    display: none;
  }
`

const HeroImage = styled.img`
  max-width: 100%;
  margin-bottom: -10px;
`

const HeroSection = () => {
  const { t } = useTranslation()
  return (
    <section>
      <Container>
        <Box mt={[5, 5, 9]} px={3}>
          <HeroTitle textAlign={'center'} fontSize={[4, 5, 6]}>
            🚀 {t('hero.title')}
          </HeroTitle>
          <HeroSubTitle
            textAlign={'center'}
            color={'gray'}
            fontSize={[3, 4]}
            fontWeight={'normal'}
          >
            {t('hero.subtitle')}
          </HeroSubTitle>

          <FlexBox
            justifyContent='center'
            mt={[5, 7, 8]}
            flexDirection={['column', 'row']}
          >
            <DownloadButtonLinksFragment />
            <ButtonLink
              bg='white'
              color='teal'
              mx={1}
              py={2}
              my={[1, 0]}
              href='https://note.boostio.co/app'
              onClick={(event) => {
                event.preventDefault()
                sendGAEvent('open-in-browser')
                queueNavigateToGA('https://note.boostio.co/app')
              }}
            >
              <Icon path={mdiOpenInApp} /> {t('common.openInBrowser')}
            </ButtonLink>
          </FlexBox>

          <FlexBox justifyContent='center' mt={2}>
            <MobileAppLink
              mx={1}
              target='_blank'
              href={androidPlayStoreUrl}
              rel='noopener noreferrer'
            >
              <img height='50' src='/static/google-play-store-badge.svg' />
            </MobileAppLink>
            <MobileAppLink
              mx={1}
              target='_blank'
              href={iOSAppStoreUrl}
              rel='noopener noreferrer'
            >
              <img height='50' src='/static/ios-app-store-badge.svg' />
            </MobileAppLink>
          </FlexBox>
        </Box>
        <Box mt={[5, 7, 7]}>
          <Text
            as='p'
            textAlign='center'
            color={'gray'}
            fontSize={[3]}
            fontWeight={'normal'}
          >
            {t('newsletter.title')}
          </Text>
          <SubscribeNewsLettersForm />
        </Box>
        <Box mt={[7, 9, 9]}>
          <HeroImage src='/static/hero.png' />
        </Box>
      </Container>
    </section>
  )
}

export default HeroSection
