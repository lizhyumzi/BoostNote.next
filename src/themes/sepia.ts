import { BaseTheme } from '../lib/styled/BaseTheme'

const base1Color = '#fdf6e4'
const base2Color = '#fbebc3'
const base3Color = '#393733'
const primaryColor = '#b38925'
const primaryDarkerColor = '#9e7921'
const dangerColor = '#DC3545'

const dark54Color = 'rgba(0,0,0,0.54)'
const dark26Color = 'rgba(0,0,0,0.26)'
const dark12Color = 'rgba(0,0,0,0.12)'
const dark87Color = '#212121'

const light100Color = '#FFF'
const light30Color = 'rgba(255,255,255,0.3)'
const light12Color = 'rgba(255,255,255,0.12)'

export const sepiaTheme: BaseTheme = {
  colors: {
    text: base3Color,
    deemedText: dark26Color,
    inverseText: light100Color,
    background: base1Color,
    alternativeBackground: base2Color,
    active: primaryColor,
    border: dark12Color,
  },

  // General
  textColor: base3Color,
  uiTextColor: base3Color,
  disabledUiTextColor: light30Color,

  primaryColor: primaryColor,
  primaryDarkerColor: primaryDarkerColor,
  dangerColor: dangerColor,
  borderColor: dark12Color,

  noteListIconColor: dark26Color,
  noteListActiveIconColor: dark54Color,
  noteDetailIconColor: dark26Color,
  noteDetailActiveIconColor: dark54Color,
  closeIconColor: dark26Color,
  closeActiveIconColor: dark54Color,
  backgroundColor: base1Color,
  secondaryBackgroundColor: base2Color,
  activeBackgroundColor: light12Color,
  shadow: '0 3px 5px rgba(0,0,0,0.1)',

  scrollBarTrackColor: base2Color,
  scrollBarThumbColor: dark12Color,

  // SideBar
  navBackgroundColor: '#fdf6e4',
  navLabelColor: '#555',
  navButtonColor: '#777',
  navButtonHoverColor: '#555',
  navButtonActiveColor: primaryColor,
  navItemColor: '#555',
  navItemBackgroundColor: 'transparent',
  navItemHoverBackgroundColor: '#eee8d6',
  navItemActiveColor: '#111',
  navItemActiveBackgroundColor: '#eee8d6',
  navItemHoverActiveBackgroundColor: '#e0e0e0',

  // Team Switcher
  teamSwitcherBackgroundColor: '#eee8d6',
  teamSwitcherBorderColor: 'transparent',
  teamSwitcherTextColor: base3Color,
  teamSwitcherHoverBackgroundColor: primaryColor,
  teamSwitcherHoverTextColor: light100Color,

  // NotePage
  noteNavEmptyItemColor: '#777',
  noteNavItemBackgroundColor: '#eee8d6',

  // Button
  primaryButtonLabelColor: light100Color,
  primaryButtonBackgroundColor: primaryColor,
  primaryButtonHoverBackgroundColor: primaryDarkerColor,
  secondaryButtonLabelColor: base3Color,
  secondaryButtonHoverLabelColor: light100Color,
  secondaryButtonBackgroundColor: '#eee8d6',
  secondaryButtonHoverBackgroundColor: '#e0e0e0',

  // Input
  inputBackground: dark12Color,

  // Search Highlight
  searchHighlightBackgroundColor: '#ffc107',
  searchHighlightSubtleBackgroundColor: '#ffdb70',
  searchItemSelectionTextColor: light100Color,
  searchItemSelectionBackgroundColor: primaryColor,
  searchItemSelectionHoverBackgroundColor: primaryDarkerColor,
  searchHighlightTextColor: dark87Color,

  // Tooltip
  tooltipBackgroundColor: 'rgba(0,0,0,0.8)',
  tooltipTextColor: '#f0f0f0',
}
