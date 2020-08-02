import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    selected: {
      row: React.CSSProperties['color'],
    };
  }
  interface PaletteOptions {
    selected: {
      row: React.CSSProperties['color'],
    };
  }
}