import { definePreset } from '@primeuix/themes'

import Aura from '@primeuix/themes/aura';
import { semantic } from '@primeuix/themes/aura/base';
import { map } from 'rxjs';

export const IngeodevPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{neutral.200}',
            100: '{neutral.300}',
            200: '{neutral.400}',
            300: '{neutral.500}',
            400: '{neutral.700}',
            500: '{neutral.900}',
            600: '{neutral.900}',
            700: '{neutral.900}',
            800: '{neutral.950}',
            900: '{neutral.950}',
            950: '{neutral.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '{neutral.50}',
                    50: '{neutral.50}',
                    100: '{neutral.100}',
                    200: '{neutral.200}',
                    300: '{neutral.300}',
                    400: '{neutral.400}',
                    500: '{neutral.500}',
                    600: '{neutral.600}',
                    700: '{neutral.700}',
                    800: '{neutral.800}',
                    900: '{neutral.900}',
                    950: '{neutral.950}'
                },
            }
        }
    },
    components: {
        fieldset: {
            root: {
                background: 'transparent'
            },
            legend: {
                background: 'transparent'
            }
        }
    }
});

/**
 *     {
    darkModeSelector: false || 'none',
    semantic: {
        primary2: {
            50: '#f2f7fc',
            100: '#e1edf8',
            200: '#c9dff4',
            300: '#a4ccec',
            400: '#79b0e1',
            500: '#5993d8',
            600: '#4378cb',
            700: '#3b66ba',
            800: '#355498',
            900: '#2f4879',
            950: '#212d4a'
        },
       
 */