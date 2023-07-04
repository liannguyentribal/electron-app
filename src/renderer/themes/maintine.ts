import { MantineThemeOverride } from '@mantine/core';

import { Colors } from '../constants';

export const mantineTheme: MantineThemeOverride = {
  colors: {
    blue: [
      '#E9EAFB',
      '#C3C5F4',
      '#9CA0ED',
      '#757AE6',
      '#4E55DF',
      '#2830D7',
      '#2B33D8',
      '#181D81',
      '#101356',
      '#080A2B',
    ],
  },
  breakpoints: {
    xs: '0px',
    sm: '0px',
  },
  fontFamily: `'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'`,
  primaryColor: 'blue',
  components: {
    Button: {
      styles: {
        root: {
          height: 48,
          fontSize: 16,
          fontWeight: 700,
        },
      },
    },
    TextInput: {
      styles: {
        root: {
          marginBottom: 16,
        },
        input: {
          height: 48,
          paddingLeft: 16,
          paddingRight: 16,
          fontWeight: 400,
          color: Colors.c_111111,
          fontSize: 14,
          borderColor: Colors.c_DDDDDD,
          backgroundColor: Colors.white,
          borderRadius: 6,

          '&:disabled': {
            color: Colors.c_111111,
            backgroundColor: Colors.c_F1F6F8,
            opacity: 1,
          },

          '&::placeholder': {
            fontWeight: 400,
            fontSize: 14,
          },
        },
      },
    },
    DatePicker: {
      styles: {
        root: {
          marginBottom: 16,
        },
        input: {
          height: 48,
          paddingLeft: 16,
          paddingRight: 16,
          fontWeight: 600,
          color: Colors.c_111111,
          fontSize: 16,
          borderColor: Colors.c_DDDDDD,
          borderRadius: 6,

          '&:disabled': {
            color: Colors.c_111111,
            backgroundColor: Colors.c_F1F6F8,
            opacity: 1,
          },

          '&::placeholder': {
            fontWeight: 500,
            fontSize: 16,
            color: '#767676',
          },
        },
        rightSection: {
          right: 15,
        },
      },
    },
    NativeSelect: {
      styles: {
        root: {
          marginBottom: 16,
        },
        input: {
          height: 48,
          paddingLeft: 16,
          paddingRight: 16,
          fontWeight: 600,
          color: Colors.c_111111,
          fontSize: 16,
          borderColor: Colors.c_DDDDDD,
          borderRadius: 6,

          '&::placeholder': {
            fontWeight: 500,
            fontSize: 16,
            color: '#767676',
          },

          '&:disabled': {
            color: Colors.c_111111,
            backgroundColor: Colors.c_F1F6F8,
            opacity: 1,
          },
        },
        rightSection: {
          right: 12,
        },
      },
    },
    Checkbox: {
      styles: {
        body: {
          alignItems: 'center',
        },
      },
    },
    NumberInput: {
      styles: {
        root: {
          marginBottom: 16,
        },
        input: {
          height: 48,
          paddingLeft: 16,
          paddingRight: 16,
          fontWeight: 600,
          color: Colors.c_111111,
          fontSize: 16,
          borderColor: Colors.c_DDDDDD,
          backgroundColor: Colors.white,
          borderRadius: 6,

          '&:disabled': {
            color: Colors.c_111111,
            backgroundColor: Colors.c_F1F6F8,
            opacity: 1,
          },

          '&::placeholder': {
            fontWeight: 500,
            fontSize: 16,
            color: '#767676',
          },
        },
        rightSection: {
          right: 12,
        },
      },
    },

    Select: {
      styles: {
        root: {
          marginBottom: 16,

          '.mantine-ScrollArea-root': {
            backgroundColor: '#00000008',
            boxShadow:
              '0 1px 3px rgb(0 0 0 / 25%), rgb(0 0 0 / 20%) 0px 10px 15px -5px, rgb(0 0 0 / 20%) 0px 7px 7px -5px',
            '.mantine-Select-item': {
              fontWeight: 600,
            },
          },
        },
        input: {
          height: 48,
          paddingLeft: 16,
          paddingRight: 16,
          fontWeight: 600,
          color: Colors.c_111111,
          fontSize: 16,
          borderColor: Colors.c_DDDDDD,
          backgroundColor: Colors.white,
          borderRadius: 6,

          '&:disabled': {
            color: Colors.c_111111,
            backgroundColor: Colors.c_F1F6F8,
            opacity: 1,
          },

          '&::placeholder': {
            fontWeight: 500,
            fontSize: 16,
            color: '#767676',
          },

          '&:has(+ .mantine-Select-rightSection)': {
            paddingRight: 48,
          },
        },
        rightSection: {
          right: 12,
        },
      },
    },
  },
};
