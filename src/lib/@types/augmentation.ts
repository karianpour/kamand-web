/// <reference types="react" />
declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
      selected: {
          row: React.CSSProperties['color'];
      };
  }
  interface PaletteOptions {
      selected: {
          row: React.CSSProperties['color'];
      };
  }
}
export {};
