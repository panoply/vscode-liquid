"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/extension.ts
var import_vscode5 = require("vscode");

// src/extension/document.ts
var import_vscode4 = require("vscode");

// src/extension/format.ts
var import_vscode3 = require("vscode");

// node_modules/.pnpm/@liquify+prettify@0.0.3-beta.1/node_modules/@liquify/prettify/index.mjs
var tt = Object.defineProperty;
var nt = (l4, c) => {
  for (var h in c)
    tt(l4, h, { get: c[h], enumerable: true });
};
var T = function() {
  const l4 = typeof process !== "undefined" && process.versions != null ? "node" : "browser";
  let c = "";
  return { env: l4, mode: "beautify", end: 0, iterator: 0, start: 0, scopes: [], beautify: {}, lexers: {}, get source() {
    return l4 === "node" && Buffer.isBuffer(c) ? c.toString() : c;
  }, set source(h) {
    c = l4 === "node" ? Buffer.isBuffer(h) ? h : Buffer.from(h) : h;
  }, data: { begin: [], ender: [], lexer: [], lines: [], stack: [], token: [], types: [] }, hooks: { before: [], language: [], rules: [], after: [] }, stats: { chars: -1, time: -1, size: "", language: "" }, options: { lexer: "auto", language: "text", languageName: "Plain Text", mode: "beautify", indentLevel: 0, crlf: false, commentIndent: true, endNewline: false, indentChar: " ", indentSize: 2, preserveComment: false, preserveLine: 2, wrap: 0, grammar: { html: { tags: [], voids: [], embedded: {} }, liquid: { tags: [], else: [], singletons: [], embedded: {} }, script: { keywords: [] }, style: { units: [] } }, markup: { correct: false, commentNewline: false, attributeCasing: "preserve", attributeValues: "preserve", attributeSort: false, attributeSortList: [], forceAttribute: false, forceLeadAttribute: false, forceIndent: false, preserveText: false, preserveAttributes: false, selfCloseSpace: false, quoteConvert: "none" }, style: { correct: false, compressCSS: false, classPadding: false, noLeadZero: false, sortSelectors: false, sortProperties: false, quoteConvert: "none", forceValue: "preserve" }, script: { correct: false, braceNewline: false, bracePadding: false, braceStyle: "none", braceAllman: false, commentNewline: false, caseSpace: false, inlineReturn: true, elseNewline: false, endComma: "never", arrayFormat: "default", objectSort: false, objectIndent: "default", functionNameSpace: false, functionSpace: false, styleGuide: "none", ternaryLine: false, methodChain: 4, neverFlatten: false, noCaseIndent: false, noSemicolon: false, quoteConvert: "none", variableList: "none", vertical: false }, json: { arrayFormat: "default", braceAllman: false, bracePadding: false, objectIndent: "default", objectSort: false } } };
}();
var C = "";
var Ce = Object.assign;
var xe = Object.create;
var ve = Object.keys;
var qe = Object.defineProperty;
var Ne = Array.isArray;
var me;
var le = new (me = class {
  constructor() {
    this.html = {};
    this.liquid = {};
    this.script = {};
    this.style = {};
    this.script.keywords = new Set(me.defaults.script.keywords);
    this.style.units = new Set(me.defaults.style.units);
    this.html.tags = new Set(me.defaults.html.tags);
    this.html.voids = new Set(me.defaults.html.voids);
    this.html.embed = {};
    this.liquid.tags = new Set(me.defaults.liquid.tags);
    this.liquid.else = new Set(me.defaults.liquid.else);
    this.liquid.singletons = new Set(me.defaults.liquid.singletons);
    this.liquid.embed = {};
    this.defaults();
  }
  embed(c, h) {
    return h in this[c].embed;
  }
  defaults() {
    for (const c in me.defaults.html.embedded) {
      this.html.embed[c] = {};
      for (const { language: h, attribute: n = null } of me.defaults.html.embedded[c]) {
        this.html.embed[c].language = h;
        if (typeof n === "object") {
          for (const o in n) {
            this.html.embed[c].attribute = o;
            if (Array.isArray(n[o])) {
              this.html.embed[c].value = (t) => new Set(n[o]).has(t);
            } else {
              this.html.embed[c].value = (t) => new RegExp(n[o]).test(t);
            }
          }
        } else {
          this.html.embed[c].attribute = null;
        }
      }
    }
    for (const c in me.defaults.liquid.embedded) {
      this.liquid.embed[c] = { end: (h) => new RegExp(`^{%-?\\s*end${c}`).test(h) };
      for (const { language: h, argument: n } of me.defaults.liquid.embedded[c]) {
        this.liquid.embed[c].language = h;
        if (n) {
          if (Array.isArray(n)) {
            this.liquid.embed[c].attribute = (o) => new Set(n).has(o);
          } else {
            this.liquid.embed[c].attribute = (o) => new RegExp(n).test(o);
          }
        } else {
          this.liquid.embed[c].attribute = null;
        }
      }
    }
  }
  extend(c) {
    for (const h in c) {
      if (h === "html") {
        if ("tags" in c[h] && Array.isArray(c[h].tags)) {
          for (const n of c[h].tags) {
            if (!this.html.tags.has(n))
              this.html.tags.add(n);
          }
        }
        if ("voids" in c[h] && Array.isArray(c[h].voids)) {
          for (const n of c[h].voids) {
            if (!this.html.voids.has(n))
              this.html.voids.add(n);
          }
        }
        if ("embedded" in c[h])
          ;
      }
      if (h === "liquid") {
        if ("tags" in c[h] && Array.isArray(c[h].tags)) {
          for (const n of c[h].tags) {
            if (!this.liquid.tags.has(n))
              this.liquid.tags.add(n);
          }
        }
        if ("else" in c[h] && Array.isArray(c[h].else)) {
          for (const n of c[h].else) {
            if (!this.liquid.else.has(n))
              this.liquid.else.add(n);
          }
        }
        if ("singletons" in c[h] && Array.isArray(c[h].singletons)) {
          for (const n of c[h].singletons) {
            if (!this.liquid.singletons.has(n))
              this.liquid.singletons.add(n);
          }
        }
        if ("embedded" in c[h] && typeof c[h].embedded === "object") {
          for (const n in c[h].embedded) {
            if (!(n in this.liquid.embed)) {
              this.liquid.embed[n] = { end: (o) => new RegExp(`{%-?\\s*end${n}`).test(o) };
            }
            for (const { language: o, argument: t } of c[h].embedded[n]) {
              if (this.liquid.embed[n].language !== o) {
                this.liquid.embed[n].language = o;
              }
              if (t) {
                if (this.liquid.embed[n].attribute === null) {
                  if (Array.isArray(t)) {
                    this.liquid.embed[n].attribute = (_) => new Set(t).has(_);
                  } else {
                    this.liquid.embed[n].attribute = (_) => new RegExp(t).test(_);
                  }
                } else {
                  const _ = [];
                  for (const I of me.defaults.liquid.embedded[n]) {
                    if (Array.isArray(I.argument)) {
                      for (const S of I.argument) {
                        if (t !== S)
                          _.push(t);
                        else
                          _.push(S);
                      }
                      this.liquid.embed[n].attribute = (S) => new Set(_).has(S);
                    } else {
                      if (I.argument !== t) {
                        this.liquid.embed[n].attribute = (S) => new RegExp(t).test(S);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (h === "style") {
        if ("units" in c[h] && Array.isArray(c[h].units)) {
          for (const n of c[h].units) {
            if (!this.style.units.has(n))
              this.style.units.add(n);
          }
        }
      }
      if (h === "script") {
        if ("keywords" in c[h] && Array.isArray(c[h].keywords)) {
          for (const n of c[h].keywords) {
            if (!this.script.keywords.has(n))
              this.script.keywords.add(n);
          }
        }
      }
    }
  }
}, me.defaults = { script: { keywords: ["ActiveXObject", "ArrayBuffer", "AudioContext", "Canvas", "CustomAnimation", "DOMParser", "DataView", "Date", "Error", "EvalError", "FadeAnimation", "FileReader", "Flash", "Float32Array", "Float64Array", "FormField", "Frame", "Generator", "HotKey", "Image", "Iterator", "Intl", "Int16Array", "Int32Array", "Int8Array", "InternalError", "Loader", "Map", "MenuItem", "MoveAnimation", "Notification", "ParallelArray", "Point", "Promise", "Proxy", "RangeError", "Rectangle", "ReferenceError", "Reflect", "RegExp", "ResizeAnimation", "RotateAnimation", "Set", "SQLite", "ScrollBar", "Set", "Shadow", "StopIteration", "Symbol", "SyntaxError", "Text", "TextArea", "Timer", "TypeError", "URL", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray", "URIError", "WeakMap", "WeakSet", "Web", "Window", "XMLHttpRequest"] }, style: { units: ["%", "cap", "ch", "cm", "deg", "dpcm", "dpi", "dppx", "em", "ex", "fr", "grad", "Hz", "ic", "in", "kHz", "lh", "mm", "ms", "mS", "pc", "pt", "px", "Q", "rad", "rem", "rlh", "s", "turn", "vb", "vh", "vi", "vmax", "vmin", "vw"] }, html: { embedded: { script: [{ language: "javascript" }, { language: "json", attribute: { type: ["application/json", "application/ld+json"] } }, { language: "jsx", attribute: { type: ["text/jsx", "application/jsx"] } }], style: [{ language: "css" }] }, voids: ["area", "base", "basefont", "br", "col", "embed", "eventsource", "frame", "hr", "image", "img", "input", "isindex", "keygen", "link", "meta", "path", "param", "progress", "source", "wbr", "use"], tags: ["body", "colgroup", "dd", "dt", "head", "html", "li", "option", "p", "tbody", "td", "tfoot", "th", "thead", "tr"] }, liquid: { embedded: { schema: [{ language: "json" }], style: [{ language: "css" }], stylesheet: [{ language: "css" }, { language: "scss", argument: /\s*['"]scss['"]/ }], javascript: [{ language: "javascript" }] }, tags: ["case", "capture", "comment", "embed", "filter", "for", "form", "if", "macro", "paginate", "raw", "switch", "tablerow", "unless", "verbatim", "schema", "style", "javascript", "highlight", "stylesheet"], else: ["default", "else", "when", "elsif"], singletons: ["assign", "increment", "decrement", "render", "include"] } }, me)();
function Ue(l4) {
  const c = xe(null);
  if (l4)
    return Ce(c, l4);
  return c;
}
function je(l4, c = " ") {
  if (l4 === 0)
    return c;
  let h = C;
  let n = 1;
  do {
    h += c;
  } while (n++ < l4);
  return h;
}
function d(l4, c) {
  if (!l4)
    return false;
  return l4.charCodeAt(0) === c;
}
function X(l4, c) {
  return d(l4, c) === false;
}
function oe(l4) {
  return /\s/.test(l4);
}
function Ze(l4) {
  const c = 1024;
  const h = 1048576;
  const n = 1073741824;
  if (l4 < c)
    return l4 + " B";
  else if (l4 < h)
    return (l4 / c).toFixed(1) + " KB";
  else if (l4 < n)
    return (l4 / h).toFixed(1) + " MB";
  else
    return (l4 / n).toFixed(1) + " GB";
}
function Ve(l4) {
  return `\\${l4}`;
}
function Ie(l4) {
  const c = l4.indexOf("{");
  const h = d(l4[c + 2], 45) ? l4.slice(c + 3).trimStart() : l4.slice(c + 2).trimStart();
  return h.slice(0, h.search(/\s/));
}
function Xe(l4) {
  const c = l4.indexOf("{");
  if (d(l4[c + 1], 37)) {
    let h = d(l4[c + 2], 45) ? l4.slice(c + 3).trimStart() : l4.slice(c + 2).trimStart();
    h = h.slice(0, h.search(/\s/));
    if (h.startsWith("end"))
      return false;
    return le.liquid.tags.has(h);
  }
  return false;
}
function Pe(l4) {
  let c = l4;
  if (Array.isArray(l4))
    c = l4.join("");
  const h = c.indexOf("{");
  if (d(c[h + 1], 37)) {
    if (d(c[h + 2], 45))
      return c.slice(h + 3).trimStart().startsWith("end");
    return c.slice(h + 2).trimStart().startsWith("end");
  }
  return false;
}
function Ae(l4, c) {
  if (c === 1) {
    return d(l4[0], 123) && (d(l4[1], 37) || d(l4[1], 123));
  } else if (c === 2) {
    return d(l4[l4.length - 1], 125) && (d(l4[l4.length - 2], 37) || d(l4[l4.length - 2], 125));
  } else if (c === 3) {
    return d(l4[0], 123) && (d(l4[1], 37) || d(l4[1], 123)) && (d(l4[l4.length - 1], 125) && (d(l4[l4.length - 2], 37) || d(l4[l4.length - 2], 123)));
  } else if (c === 4) {
    return /{[{%}]/.test(l4);
  } else if (c === 5) {
    return /{[{%]/.test(l4) && /[%}]}/.test(l4);
  }
}
function Te(l4) {
  let c = 0;
  const h = l4.length;
  const n = l4;
  const o = () => {
    let _ = 0;
    const I = n.length;
    if (_ < I) {
      do {
        if (Ne(n[_]) === true)
          n[_] = Te.apply(this, n[_]);
        _ = _ + 1;
      } while (_ < I);
    }
  };
  const t = (_) => {
    let I = c;
    let S = 0;
    let b = 0;
    let a = 0;
    let e = [];
    let y = n[c];
    let F = "";
    const i = typeof y;
    if (I < h) {
      do {
        F = typeof n[I];
        if (n[I] < y || F < i) {
          y = n[I];
          e = [I];
        } else if (n[I] === y) {
          e.push(I);
        }
        I = I + 1;
      } while (I < h);
    }
    b = e.length;
    I = c;
    S = b + c;
    if (I < S) {
      do {
        n[e[a]] = n[I];
        n[I] = y;
        a = a + 1;
        I = I + 1;
      } while (I < S);
    }
    c = c + b;
    if (c < h) {
      t("");
    } else {
      if (this.recursive === true)
        o();
      l4 = n;
    }
    return _;
  };
  t("");
  return l4;
}
function De(l4) {
  let c = 0;
  const h = l4.length;
  const n = l4;
  const o = () => {
    let _ = 0;
    const I = n.length;
    if (_ < I) {
      do {
        if (Ne(n[_]))
          n[_] = De.apply(this, n[_]);
        _ = _ + 1;
      } while (_ < I);
    }
  };
  const t = (_) => {
    let I = c;
    let S = 0;
    let b = 0;
    let a = 0;
    let e = n[c];
    let y = [];
    let F = "";
    const i = typeof e;
    if (I < h) {
      do {
        F = typeof n[I];
        if (n[I] > e || F > i) {
          e = n[I];
          y = [I];
        } else if (n[I] === e) {
          y.push(I);
        }
        I = I + 1;
      } while (I < h);
    }
    b = y.length;
    I = c;
    S = b + c;
    if (I < S) {
      do {
        n[y[a]] = n[I];
        n[I] = e;
        a = a + 1;
        I = I + 1;
      } while (I < S);
    }
    c = c + b;
    if (c < h) {
      t("");
    } else {
      if (this.recursive === true)
        o();
      l4 = n;
    }
    return _;
  };
  t("");
  return l4;
}
function Me(l4) {
  let c = l4;
  const h = [l4[0]];
  const n = () => {
    let t = 0;
    const _ = c.length;
    if (t < _) {
      do {
        if (Ne(c[t]))
          c[t] = Me.apply(this, c[t]);
        t = t + 1;
      } while (t < _);
    }
  };
  const o = (t) => {
    let _ = 0;
    const I = [];
    const S = c.length;
    if (_ < S) {
      do {
        if (c[_] !== t)
          I.push(c[_]);
        _ = _ + 1;
      } while (_ < S);
    }
    c = I;
    if (I.length > 0) {
      h.push(I[0]);
      o(I[0]);
    } else {
      if (this.recursive === true)
        n();
      l4 = c;
    }
  };
  o(this.array[0]);
  return l4;
}
var s = new class xt {
  constructor() {
    this.datanames = ["begin", "ender", "lexer", "lines", "stack", "token", "types"];
    this.data = { begin: [], ender: [], lexer: [], lines: [], stack: [], token: [], types: [] };
    this.structure = [["global", -1]];
    this.references = [[]];
    this.count = -1;
    this.lineNumber = 1;
    this.linesSpace = 0;
    this.error = "";
  }
  get current() {
    const { begin: c, ender: h, lexer: n, lines: o, stack: t, token: _, types: I } = this.data;
    return { begin: c[c.length - 1], ender: h[h.length - 1], lexer: n[n.length - 1], lines: o[o.length - 1], stack: t[t.length - 1], token: _[c.length - 1], types: I[c.length - 1] };
  }
  init() {
    this.error = "";
    this.count = -1;
    this.linesSpace = 0;
    this.lineNumber = 1;
    this.references = [[]];
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.structure = [["global", -1]];
    this.structure.pop = () => {
      const c = this.structure.length - 1;
      const h = this.structure[c];
      if (c > 0)
        this.structure.splice(c, 1);
      return h;
    };
    return this.data;
  }
  concat(c, h) {
    for (const n of this.datanames)
      c[n] = c[n].concat(h[n]);
    if (c === this.data)
      this.count = c.token.length - 1;
  }
  objectSort(c) {
    let h = this.count;
    let n = this.structure[this.structure.length - 1][1];
    let o = 0;
    let t = 0;
    let _ = 0;
    let I = 0;
    let S = true;
    let b = 0;
    let a = 0;
    let e = 0;
    const y = [];
    const F = n;
    const i = T.options.language === "json";
    const N = c.lexer[h] === "style" && this.structure[this.structure.length - 1][0] === "global";
    const w = c.lexer[h] === "style";
    const p = w === true ? [";", "separator"] : [",", "separator"];
    const P = this.linesSpace;
    const U = this.count;
    const V = N === true ? "global" : this.structure[this.structure.length - 1][0];
    function f(x, m) {
      let A = x[0];
      let E = m[0];
      if (c.types[A] === "comment") {
        do {
          A = A + 1;
        } while (A < U && c.types[A] === "comment");
        if (c.token[A] === void 0) {
          return 1;
        }
      }
      if (c.types[E] === "comment") {
        do {
          E = E + 1;
        } while (E < U && c.types[E] === "comment");
        if (c.token[E] === void 0)
          return 1;
      }
      if (w === true) {
        if (c.token[A].indexOf("@import") === 0 || c.token[E].indexOf("@import") === 0) {
          return A < E ? -1 : 1;
        }
        if (c.types[A] !== c.types[E]) {
          if (c.types[A] === "function")
            return 1;
          if (c.types[A] === "variable")
            return -1;
          if (c.types[A] === "selector")
            return 1;
          if (c.types[A] === "property" && c.types[E] !== "variable")
            return -1;
          if (c.types[A] === "mixin" && c.types[E] !== "property" && c.types[E] !== "variable")
            return -1;
        }
      }
      if (c.token[A].toLowerCase() > c.token[E].toLowerCase())
        return 1;
      return -1;
    }
    const g = { begin: [], ender: [], lexer: [], lines: [], stack: [], token: [], types: [] };
    I = h;
    do {
      if (c.begin[h] === n || N === true && h < I && c.token[h] === "}" && c.begin[c.begin[h]] === -1) {
        if (c.types[h].indexOf("template") > -1)
          return;
        if (c.token[h] === p[0] || w === true && c.token[h] === "}" && c.token[h + 1] !== ";") {
          S = true;
          b = h + 1;
        } else if (w === true && c.token[h - 1] === "}") {
          S = true;
          b = h;
        }
        if (b === 0 && c.types[0] === "comment") {
          do {
            b = b + 1;
          } while (c.types[b] === "comment");
        } else if (c.types[b] === "comment" && c.lines[b] < 2) {
          b = b + 1;
        }
        if (S === true && (c.token[h] === p[0] || w === true && c.token[h - 1] === "}") && b <= I) {
          if (w === true && "};".indexOf(c.token[I]) < 0) {
            I = I + 1;
          } else if (w === false && c.token[I] !== ",") {
            I = I + 1;
          }
          y.push([b, I]);
          if (w === true && c.token[b] === "}") {
            I = b;
          } else {
            I = b - 1;
          }
        }
      }
      h = h - 1;
    } while (h > n);
    if (y.length > 0 && y[y.length - 1][0] > h + 1) {
      o = y[y.length - 1][0] - 1;
      if (c.types[o] === "comment" && c.lines[o] > 1) {
        do {
          o = o - 1;
        } while (o > 0 && c.types[o] === "comment");
        y[y.length - 1][0] = o + 1;
      }
      if (c.types[h + 1] === "comment" && h === -1) {
        do {
          h = h + 1;
        } while (c.types[h + 1] === "comment");
      }
      y.push([h + 1, o]);
    }
    if (y.length > 1) {
      if (i === true || w === true || c.token[h - 1] === "=" || c.token[h - 1] === ":" || c.token[h - 1] === "(" || c.token[h - 1] === "[" || c.token[h - 1] === "," || c.types[h - 1] === "word" || h === 0) {
        y.sort(f);
        e = y.length;
        S = false;
        n = 0;
        do {
          a = y[n][1];
          if (w === true) {
            _ = a;
            if (c.types[_] === "comment")
              _ = _ - 1;
            if (c.token[_] === "}") {
              a = a + 1;
              p[0] = "}";
              p[1] = "end";
            } else {
              p[0] = ";";
              p[1] = "separator";
            }
          }
          o = y[n][0];
          if (w === true && c.types[a - 1] !== "end" && c.types[a] === "comment" && c.types[a + 1] !== "comment" && n < e - 1) {
            a = a + 1;
          }
          if (o < a) {
            do {
              if (w === false && n === e - 1 && o === a - 2 && c.token[o] === "," && c.lexer[o] === "script" && c.types[o + 1] === "comment") {
                t = t + 1;
              } else {
                this.push(g, { begin: c.begin[o], ender: c.ender[o], lexer: c.lexer[o], lines: c.lines[o], stack: c.stack[o], token: c.token[o], types: c.types[o] });
                t = t + 1;
              }
              if (c.token[o] === p[0] && (w === true || c.begin[o] === c.begin[y[n][0]])) {
                S = true;
              } else if (c.token[o] !== p[0] && c.types[o] !== "comment") {
                S = false;
              }
              o = o + 1;
            } while (o < a);
          }
          if (S === false && g.token[g.token.length - 1] !== "x;" && (w === true || n < e - 1)) {
            o = g.types.length - 1;
            if (g.types[o] === "comment") {
              do {
                o = o - 1;
              } while (o > 0 && g.types[o] === "comment");
            }
            o = o + 1;
            this.splice({ data: g, howmany: 0, index: o, record: { begin: F, stack: V, ender: this.count, lexer: g.lexer[o - 1], lines: 0, token: p[0], types: p[1] } });
            t = t + 1;
          }
          n = n + 1;
        } while (n < e);
        this.splice({ data: c, howmany: t, index: h + 1 });
        this.linesSpace = P;
        this.concat(c, g);
      }
    }
  }
  pop(c) {
    const h = { begin: c.begin.pop(), ender: c.ender.pop(), lexer: c.lexer.pop(), lines: c.lines.pop(), stack: c.stack.pop(), token: c.token.pop(), types: c.types.pop() };
    if (c === this.data)
      this.count = this.count - 1;
    return h;
  }
  push(c, h, n = "") {
    const o = () => {
      let t = this.count;
      const _ = c.begin[t];
      if (c.lexer[t] === "style" && T.options.style.sortProperties === true || c.lexer[t] === "script" && (T.options.script.objectSort === true || T.options.json.objectSort === true)) {
        return;
      }
      do {
        if (c.begin[t] === _ || c.begin[c.begin[t]] === _ && c.types[t].indexOf("attribute") > -1 && c.types[t].indexOf("attribute_end") < 0) {
          c.ender[t] = this.count;
        } else {
          t = c.begin[t];
        }
        t = t - 1;
      } while (t > _);
      if (t > -1)
        c.ender[t] = this.count;
    };
    this.datanames.forEach((t) => c[t].push(h[t]));
    if (c === this.data) {
      this.count = this.count + 1;
      this.linesSpace = 0;
      if (h.lexer !== "style") {
        if (n.replace(/(\{|\}|@|<|>|%|#|)/g, "") === "") {
          n = h.types === "else" ? "else" : n = h.token;
        }
      }
      if (h.types === "start" || h.types.indexOf("_start") > 0) {
        this.structure.push([n, this.count]);
      } else if (h.types === "end" || h.types.indexOf("_end") > 0) {
        let t = 0;
        if (this.structure.length > 2 && (c.types[this.structure[this.structure.length - 1][1]] === "else" || c.types[this.structure[this.structure.length - 1][1]].indexOf("_else") > 0) && (c.types[this.structure[this.structure.length - 2][1]] === "start" || c.types[this.structure[this.structure.length - 2][1]].indexOf("_start") > 0) && (c.types[this.structure[this.structure.length - 2][1] + 1] === "else" || c.types[this.structure[this.structure.length - 2][1] + 1].indexOf("_else") > 0)) {
          this.structure.pop();
          c.begin[this.count] = this.structure[this.structure.length - 1][1];
          c.stack[this.count] = this.structure[this.structure.length - 1][0];
          c.ender[this.count - 1] = this.count;
          t = c.ender[c.begin[this.count] + 1];
        }
        o();
        if (t > 0)
          c.ender[c.begin[this.count] + 1] = t;
        this.structure.pop();
      } else if (h.types === "else" || h.types.indexOf("_else") > 0) {
        if (n === "")
          n = "else";
        if (this.count > 0 && (c.types[this.count - 1] === "start" || c.types[this.count - 1].indexOf("_start") > 0)) {
          this.structure.push([n, this.count]);
        } else {
          o();
          if (n === "") {
            this.structure[this.structure.length - 1] = ["else", this.count];
          } else {
            this.structure[this.structure.length - 1] = [n, this.count];
          }
        }
      }
    }
  }
  safeSort(c, h, n) {
    if (Ne(c) === false)
      return c;
    if (h === "normal") {
      return Me.call({ array: c, recursive: n }, c);
    } else if (h === "descend") {
      return De.call({ recursive: n }, c);
    }
    return Te.call({ recursive: n }, c);
  }
  sortCorrection(c, h) {
    let n = c;
    let o = -1;
    const t = this.data;
    const _ = [];
    const I = this.structure.length < 2 ? [-1] : [this.structure[this.structure.length - 2][1]];
    do {
      if (n > 0 && t.types[n].indexOf("attribute") > -1 && t.types[n].indexOf("end") < 0 && t.types[n - 1].indexOf("start") < 0 && t.types[n - 1].indexOf("attribute") < 0 && t.lexer[n] === "markup") {
        I.push(n - 1);
      }
      if (n > 0 && t.types[n - 1].indexOf("attribute") > -1 && t.types[n].indexOf("attribute") < 0 && t.lexer[I[I.length - 1]] === "markup" && t.types[I[I.length - 1]].indexOf("start") < 0) {
        I.pop();
      }
      if (t.begin[n] !== I[I.length - 1]) {
        if (I.length > 0) {
          t.begin[n] = I[I.length - 1];
        } else {
          t.begin[n] = -1;
        }
      }
      if (t.types[n].indexOf("else") > -1) {
        if (I.length > 0) {
          I[I.length - 1] = n;
        } else {
          I.push(n);
        }
      }
      if (t.types[n].indexOf("end") > -1)
        I.pop();
      if (t.types[n].indexOf("start") > -1)
        I.push(n);
      n = n + 1;
    } while (n < h);
    n = h;
    do {
      n = n - 1;
      if (t.types[n].indexOf("end") > -1) {
        _.push(n);
        o = o + 1;
      }
      t.ender[n] = o > -1 ? _[o] : -1;
      if (t.types[n].indexOf("start") > -1) {
        _.pop();
        o = o - 1;
      }
    } while (n > c);
  }
  spacer(c) {
    this.linesSpace = 1;
    do {
      if (c.array[c.index] === "\n") {
        this.linesSpace = this.linesSpace + 1;
        this.lineNumber = this.lineNumber + 1;
      }
      if (oe(c.array[c.index + 1]) === false)
        break;
      c.index = c.index + 1;
    } while (c.index < c.end);
    return c.index;
  }
  splice(c) {
    const h = [this.data.begin[this.count], this.data.token[this.count]];
    if (c.record !== void 0 && c.record.token !== "") {
      for (const n of this.datanames) {
        c.data[n].splice(c.index, c.howmany, c.record[n]);
      }
      if (c.data === this.data) {
        this.count = this.count - c.howmany + 1;
        if (h[0] !== this.data.begin[this.count] || h[1] !== this.data.token[this.count]) {
          this.linesSpace = 0;
        }
      }
      return;
    }
    for (const n of this.datanames) {
      c.data[n].splice(c.index, c.howmany);
    }
    if (c.data === this.data) {
      this.count = this.count - c.howmany;
      this.linesSpace = 0;
    }
  }
  wrapCommentBlock(c) {
    const { wrap: h, crlf: n, preserveComment: o } = T.options;
    const t = [];
    const _ = [];
    const I = n === true ? "\r\n" : "\n";
    const S = /(\/|\\|\||\*|\[|\]|\{|\})/g;
    const b = /{%-?\s*|\s*-?%}/g;
    let a = c.start;
    let e = 0;
    let y = 0;
    let F = 0;
    let i = 0;
    let N = [];
    let w = "";
    let p = "";
    let P = false;
    let U = false;
    let V = false;
    let f = false;
    let g = "";
    let x = c.terminator.length - 1;
    let m = c.terminator.charAt(x);
    let A = 0;
    let E;
    const $ = c.opening.replace(S, Ve);
    const q = new RegExp(`^(${$}\\s*@prettify-ignore-start)`);
    const R = new RegExp(`(${$}\\s*)`);
    const ee = d(c.opening[0], 123) && d(c.opening[1], 37);
    if (ee) {
      E = new RegExp(`\\s*${c.terminator.replace(b, (Z) => {
        if (Z.charCodeAt(0) === 123)
          return "{%-?\\s*";
        return "\\s*-?%}";
      })}$`);
    }
    const z = () => {
      if (/^\s+$/.test(N[e + 1]) || N[e + 1] === "") {
        do {
          e = e + 1;
        } while (e < i && (/^\s+$/.test(N[e + 1]) || N[e + 1] === ""));
      }
      if (e < i - 1)
        _.push("");
    };
    do {
      t.push(c.chars[a]);
      if (c.chars[a] === "\n")
        this.lineNumber = this.lineNumber + 1;
      if (c.chars[a] === m && c.chars.slice(a - x, a + 1).join("") === c.terminator)
        break;
      a = a + 1;
    } while (a < c.end);
    g = t.join("");
    if (q.test(g) === true) {
      let Z = "\n";
      a = a + 1;
      do {
        t.push(c.chars[a]);
        if (t.slice(t.length - 20).join("") === "@prettify-ignore-end") {
          if (ee) {
            const te = c.chars.indexOf("{", a);
            if (d(c.chars[te + 1], 37)) {
              const Q = c.chars.slice(te, c.chars.indexOf("}", te + 1) + 1).join("");
              if (E.test(Q))
                c.terminator = Q;
            }
          }
          a = a + 1;
          break;
        }
        a = a + 1;
      } while (a < c.end);
      e = a;
      x = c.opening.length - 1;
      m = c.opening.charAt(x);
      do {
        if (c.opening === "/*" && c.chars[e - 1] === "/" && (c.chars[e] === "*" || c.chars[e] === "/"))
          break;
        if (c.opening !== "/*" && c.chars[e] === m && c.chars.slice(e - x, e + 1).join("") === c.opening)
          break;
        e = e - 1;
      } while (e > c.start);
      if (c.opening === "/*" && c.chars[e] === "*") {
        Z = "*/";
      } else if (c.opening !== "/*") {
        Z = c.terminator;
      }
      x = Z.length - 1;
      m = Z.charAt(x);
      if (Z !== "\n" || c.chars[a] !== "\n") {
        do {
          t.push(c.chars[a]);
          if (Z === "\n" && c.chars[a + 1] === "\n")
            break;
          if (c.chars[a] === m && c.chars.slice(a - x, a + 1).join("") === Z)
            break;
          a = a + 1;
        } while (a < c.end);
      }
      if (c.chars[a] === "\n")
        a = a - 1;
      g = t.join("").replace(/\s+$/, "");
      return [g, a];
    }
    if (o === true || h < 1 || a === c.end || g.length <= h && g.indexOf("\n") < 0 || c.opening === "/*" && g.indexOf("\n") > 0 && g.replace("\n", "").indexOf("\n") > 0 && /\n(?!(\s*\*))/.test(g) === false) {
      return [g, a];
    }
    e = c.start;
    if (e > 0 && c.chars[e - 1] !== "\n" && oe(c.chars[e - 1])) {
      do {
        e = e - 1;
      } while (e > 0 && c.chars[e - 1] !== "\n" && oe(c.chars[e - 1]));
    }
    w = c.chars.slice(e, c.start).join("");
    const G = new RegExp("\n" + w, "g");
    N = g.replace(/\r\n/g, "\n").replace(G, "\n").split("\n");
    i = N.length;
    N[0] = N[0].replace(R, "");
    N[i - 1] = N[i - 1].replace(E, "");
    if (i < 2)
      N = N[0].split(" ");
    if (N[0] === "") {
      N[0] = c.opening;
    } else {
      N.splice(0, 0, c.opening);
    }
    i = N.length;
    e = 0;
    do {
      p = e < i - 1 ? N[e + 1].replace(/^\s+/, "") : "";
      if (/^\s+$/.test(N[e]) === true || N[e] === "") {
        z();
      } else if (N[e].slice(0, 4) === "    ") {
        _.push(N[e]);
      } else if (N[e].replace(/^\s+/, "").length > h && N[e].replace(/^\s+/, "").indexOf(" ") > h) {
        N[e] = N[e].replace(/^\s+/, "");
        y = N[e].indexOf(" ");
        _.push(N[e].slice(0, y));
        N[e] = N[e].slice(y + 1);
        e = e - 1;
      } else {
        N[e] = c.opening === "/*" && N[e].indexOf("/*") !== 0 ? `   ${N[e].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}` : `${N[e].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`;
        A = e < 1 ? h - (c.opening.length + 1) : h;
        y = N[e].length;
        F = N[e].replace(/^\s+/, "").indexOf(" ");
        if (y > A && F > 0 && F < A) {
          y = A;
          do {
            y = y - 1;
            if (oe(N[e].charAt(y)) && y <= h)
              break;
          } while (y > 0);
          if (N[e].slice(0, 4) !== "    " && /^\s*(\*|-)\s/.test(N[e]) === true && /^\s*(\*|-)\s/.test(N[e + 1]) === false) {
            N.splice(e + 1, 0, "* ");
          }
          if (N[e].slice(0, 4) !== "    " && /^\s*\d+\.\s/.test(N[e]) === true && /^\s*\d+\.\s/.test(N[e + 1]) === false) {
            N.splice(e + 1, 0, "1. ");
          }
          if (y < 4) {
            _.push(N[e]);
            f = true;
          } else if (e === i - 1) {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            f = true;
            e = e - 1;
          } else if (/^\s+$/.test(N[e + 1]) === true || N[e + 1] === "") {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            P = true;
            e = e - 1;
          } else if (N[e + 1].slice(0, 4) !== "    " && /^\s*(\*|-)\s/.test(N[e + 1])) {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            U = true;
            e = e - 1;
          } else if (N[e + 1].slice(0, 4) !== "    " && /^\s*\d+\.\s/.test(N[e + 1])) {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            V = true;
            e = e - 1;
          } else if (N[e + 1].slice(0, 4) === "    ") {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            f = true;
            e = e - 1;
          } else if (y + p.length > h && p.indexOf(" ") < 0) {
            _.push(N[e].slice(0, y));
            N[e] = N[e].slice(y + 1);
            f = true;
            e = e - 1;
          } else if (N[e].replace(/^\s+/, "").indexOf(" ") < h) {
            N[e + 1] = N[e].length > h ? N[e].slice(y + 1) + I + N[e + 1] : `${N[e].slice(y + 1)} ${N[e + 1]}`;
          }
          if (P === false && U === false && V === false && f === false) {
            N[e] = N[e].slice(0, y);
          }
        } else if (N[e + 1] !== void 0 && (N[e].length + p.indexOf(" ") > h && p.indexOf(" ") > 0 || N[e].length + p.length > h && p.indexOf(" ") < 0)) {
          _.push(N[e]);
          e = e + 1;
        } else if (N[e + 1] !== void 0 && /^\s+$/.test(N[e + 1]) === false && N[e + 1] !== "" && N[e + 1].slice(0, 4) !== "    " && /^\s*(\*|-|(\d+\.))\s/.test(N[e + 1]) === false) {
          N[e + 1] = `${N[e]} ${N[e + 1]}`;
          P = true;
        }
        if (f === false && U === false && V === false) {
          if (P === true) {
            P = false;
          } else if (/^\s*(\*|-|(\d+\.))\s*$/.test(N[e]) === false) {
            if (e < i - 1 && N[e + 1] !== "" && /^\s+$/.test(N[e]) === false && N[e + 1].slice(0, 4) !== "    " && /^\s*(\*|-|(\d+\.))\s/.test(N[e + 1]) === false) {
              N[e] = `${N[e]} ${N[e + 1]}`;
              N.splice(e + 1, 1);
              i = i - 1;
              e = e - 1;
            } else {
              if (c.opening === "/*" && N[e].indexOf("/*") !== 0) {
                _.push(`   ${N[e].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`);
              } else {
                _.push(`${N[e].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`);
              }
            }
          }
        }
        f = false;
        U = false;
        V = false;
      }
      e = e + 1;
    } while (e < i);
    if (_.length > 0) {
      if (_[_.length - 1].length > h - (c.terminator.length + 1)) {
        _.push(c.terminator);
      } else {
        _[_.length - 1] = `${_[_.length - 1]} ${c.terminator}`;
      }
      g = _.join(I);
    } else {
      N[N.length - 1] = N[N.length - 1] + c.terminator;
      g = N.join(I);
    }
    return [g, a];
  }
  wrapCommentLine(c) {
    let h = c.start;
    let n = 0;
    let o = "";
    let t = [];
    const { wrap: _, preserveComment: I } = T.options;
    function S() {
      let a = "";
      do {
        n = n + 1;
        if (c.chars[n + 1] === "\n")
          return;
      } while (n < c.end && oe(c.chars[n]) === true);
      if (c.chars[n] + c.chars[n + 1] === "//") {
        t = [];
        do {
          t.push(c.chars[n]);
          n = n + 1;
        } while (n < c.end && c.chars[n] !== "\n");
        a = t.join("");
        if (/^\/\/ (\*|-|(\d+\.))/.test(a) === false && a.slice(0, 6) !== "//    " && /^\/\/\s*$/.test(a) === false) {
          o = `${o} ${a.replace(/(^\/\/\s*)/, "").replace(/\s+$/, "")}`;
          h = n - 1;
          S();
        }
      }
    }
    const b = () => {
      const a = [];
      const e = { ender: -1, types: "comment", lexer: c.lexer, lines: this.linesSpace };
      if (this.count > -1) {
        e.begin = this.structure[this.structure.length - 1][1];
        e.stack = this.structure[this.structure.length - 1][0];
        e.token = this.data.token[this.count];
      } else {
        e.begin = -1;
        e.stack = "global";
        e.token = "";
      }
      let y = 0;
      let F = 0;
      o = o.replace(/\s+/g, " ").replace(/\s+$/, "");
      F = o.length;
      if (_ > F)
        return;
      do {
        y = _;
        if (o.charAt(y) !== " ") {
          do {
            y = y - 1;
          } while (y > 0 && o.charAt(y) !== " ");
          if (y < 3) {
            y = _;
            do {
              y = y + 1;
            } while (y < F - 1 && o.charAt(y) !== " ");
          }
        }
        a.push(o.slice(0, y));
        o = `// ${o.slice(y).replace(/^\s+/, "")}`;
        F = o.length;
      } while (_ < F);
      y = 0;
      F = a.length;
      do {
        e.token = a[y];
        this.push(this.data, e, C);
        e.lines = 2;
        this.linesSpace = 2;
        y = y + 1;
      } while (y < F);
    };
    do {
      t.push(c.chars[h]);
      h = h + 1;
    } while (h < c.end && c.chars[h] !== "\n");
    if (h === c.end) {
      c.chars.push("\n");
    } else {
      h = h - 1;
    }
    o = t.join("").replace(/\s+$/, "");
    if (/^(\/\/\s*@prettify-ignore-start\b)/.test(o) === true) {
      let a = "\n";
      h = h + 1;
      do {
        t.push(c.chars[h]);
        h = h + 1;
      } while (h < c.end && (c.chars[h - 1] !== "d" || c.chars[h - 1] === "d" && t.slice(t.length - 20).join("") !== "@prettify-ignore-end"));
      n = h;
      do {
      } while (n > c.start && c.chars[n - 1] === "/" && (c.chars[n] === "*" || c.chars[n] === "/"));
      if (c.chars[n] === "*")
        a = "*/";
      if (a !== "\n" || c.chars[h] !== "\n") {
        do {
          t.push(c.chars[h]);
          if (a === "\n" && c.chars[h + 1] === "\n")
            break;
          h = h + 1;
        } while (h < c.end && (a === "\n" || a === "*/" && (c.chars[h - 1] !== "*" || c.chars[h] !== "/")));
      }
      if (c.chars[h] === "\n")
        h = h - 1;
      o = t.join("").replace(/\s+$/, "");
      return [o, h];
    }
    if (o === "//" || o.slice(0, 6) === "//    " || I === true) {
      return [o, h];
    }
    o = o.replace(/(\/\/\s*)/, "// ");
    if (_ < 1 || h === c.end - 1 && this.data.begin[this.count] < 1)
      return [o, h];
    n = h + 1;
    S();
    b();
    return [o, h];
  }
}();
T.lexers.style = function l(c) {
  const { options: h } = T;
  const n = h.style;
  const { data: o } = s;
  const t = c.split(C);
  const _ = c.length;
  const I = [];
  const S = [];
  let b = 0;
  let a = C;
  let e = C;
  function y(f) {
    const g = xe(null);
    g.begin = s.structure[s.structure.length - 1][1];
    g.ender = -1;
    g.lexer = "style";
    g.lines = s.linesSpace;
    g.stack = s.structure[s.structure.length - 1][0];
    g.token = e;
    g.types = a;
    s.push(o, g, f);
  }
  function F(f) {
    const g = f;
    do {
      f = f - 1;
    } while (t[f] === "\\" && f > 0);
    return (g - f) % 2 === 1;
  }
  function i(f) {
    const g = f.replace(/\s*!important/, " !important").split(C);
    const x = /-?transition$/.test(o.token[s.count - 2]);
    const m = [];
    const A = /(\s|\(|,)-?0+\.?\d+([a-z]|\)|,|\s)/g;
    const E = /(\s|\(|,)-?\.?\d+([a-z]|\)|,|\s)/g;
    let $ = 0;
    let q = 0;
    let R = C;
    let ee = g.length;
    let z = [];
    const G = (B) => {
      return B;
    };
    const Z = (B) => {
      B = B.replace(/\s*/g, C);
      return /\/\d/.test(B) && f.indexOf("url(") === 0 ? B : ` ${B.charAt(0)} ${B.charAt(1)}`;
    };
    const te = (B) => {
      if (n.noLeadZero === true) {
        return B.replace(/^-?\D0+(\.|\d)/, (H) => H.replace(/0+/, C));
      } else if (/0*\./.test(B)) {
        return B.replace(/0*\./, "0.");
      } else if (/0+/.test(/\d+/.exec(B)[0])) {
        return /^\D*0+\D*$/.test(B) ? B.replace(/0+/, "0") : B.replace(/\d+/.exec(B)[0], /\d+/.exec(B)[0].replace(/^0+/, C));
      }
      return B;
    };
    const Q = (B) => B.replace(",", ", ");
    const ne = (B) => `${B} `;
    const ke = () => {
      const B = $ - 1;
      let H = B;
      if (B < 1)
        return true;
      do {
        H = H - 1;
      } while (H > 0 && g[H] === "\\");
      return (B - H) % 2 === 1;
    };
    if ($ < ee) {
      do {
        z.push(g[$]);
        if (g[$ - 1] !== "\\" || ke() === false) {
          if (R === C) {
            if (d(g[$], 34)) {
              R = '"';
              q = q + 1;
            } else if (d(g[$], 39)) {
              R = "'";
              q = q + 1;
            } else if (d(g[$], 40)) {
              R = ")";
              q = q + 1;
            } else if (d(g[$], 91)) {
              R = "]";
              q = q + 1;
            }
          } else if (d(g[$], 40) && d(R, 41) || d(g[$], 91) && d(R, 93)) {
            q = q + 1;
          } else if (g[$] === R) {
            q = q - 1;
            if (q === 0)
              R = C;
          }
        }
        if (R === C && g[$] === " ") {
          z.pop();
          m.push(G(z.join(C)));
          z = [];
        }
        $ = $ + 1;
      } while ($ < ee);
    }
    m.push(G(z.join(C)));
    ee = m.length;
    $ = 0;
    if ($ < ee) {
      do {
        if (n.noLeadZero === true && /^-?0+\.\d+[a-z]/.test(m[$]) === true) {
          m[$] = m[$].replace(/0+\./, ".");
        } else if (n.noLeadZero === false && /^-?\.\d+[a-z]/.test(m[$])) {
          m[$] = m[$].replace(".", "0.");
        } else if (A.test(m[$]) || E.test(m[$])) {
          m[$] = m[$].replace(A, te).replace(E, te);
        } else if (/^(0+([a-z]{2,3}|%))$/.test(m[$]) && x === false) {
          m[$] = "0";
        } else if (/^(0+)/.test(m[$])) {
          m[$] = m[$].replace(/0+/, "0");
          if (/\d/.test(m[$].charAt(1)))
            m[$] = m[$].substr(1);
        } else if (/^url\((?!('|"))/.test(m[$]) && m[$].charCodeAt(m[$].length - 1) === 41) {
          R = m[$].charAt(m[$].indexOf("url(") + 4);
          if (R !== "@" && X(R, 40) && X(R, 60)) {
            if (n.quoteConvert === "double") {
              m[$] = m[$].replace(/url\(/, 'url("').replace(/\)$/, '")');
            } else {
              m[$] = m[$].replace(/url\(/, "url('").replace(/\)$/, "')");
            }
          }
        }
        if (/^(\+|-)?\d+(\.\d+)?(e-?\d+)?\D+$/.test(m[$])) {
          if (!le.style.units.has(m[$].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, C))) {
            m[$] = m[$].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, ne);
          }
        }
        if (/^\w+\(/.test(m[$]) && m[$].charAt(m[$].length - 1) === ")" && (m[$].indexOf("url(") !== 0 || m[$].indexOf("url(") === 0 && m[$].indexOf(" ") > 0)) {
          m[$] = m[$].replace(/,\S/g, Q);
        }
        $ = $ + 1;
      } while ($ < ee);
    }
    R = m.join(" ");
    return R.charAt(0) + R.slice(1).replace(/\s*(\/|\+|\*)\s*(\d|\$)/, Z);
  }
  function N() {
    const f = [];
    const g = [];
    const x = n.quoteConvert;
    let m = b;
    let A = 0;
    let E = C;
    let $ = null;
    const q = () => {
      g.push(t[m]);
      if (oe(t[m + 1])) {
        do {
          m = m + 1;
        } while (m < _ && oe(t[m + 1]));
      }
    };
    if (m < _) {
      do {
        if (d(t[m], 34) || d(t[m], 39)) {
          if ($ === null)
            $ = false;
          if (f[f.length - 1] === t[m] && (t[m - 1] !== "\\" || F(m - 1) === false)) {
            f.pop();
            if (x === "double") {
              t[m] = '"';
            } else if (x === "single") {
              t[m] = "'";
            }
          } else if (X(f[f.length - 1], 34) && X(f[f.length - 1], 39) && (t[m - 1] !== "\\" || F(m - 1) === false)) {
            f.push(t[m]);
            if (x === "double") {
              t[m] = '"';
            } else if (x === "single") {
              t[m] = "'";
            }
          } else if (t[m - 1] === "\\" && x !== "none") {
            if (F(m - 1) === true) {
              if (x === "double" && d(t[m], 39)) {
                g.pop();
              } else if (x === "single" && d(t[m], 34)) {
                g.pop();
              }
            }
          } else if (x === "double" && d(t[m], 34)) {
            t[m] = '\\"';
          } else if (x === "single" && d(t[m], 39)) {
            t[m] = "\\'";
          }
          g.push(t[m]);
        } else if (t[m - 1] !== "\\" || F(m - 1) === false) {
          if (d(t[m], 40)) {
            if ($ === null)
              $ = true;
            f.push(")");
            q();
          } else if (d(t[m], 91)) {
            $ = false;
            f.push("]");
            q();
          } else if ((d(t[m], 35) || d(t[m], 64)) && d(t[m + 1], 123)) {
            $ = false;
            g.push(t[m]);
            m = m + 1;
            f.push("}");
            q();
          } else if (t[m] === f[f.length - 1]) {
            g.push(t[m]);
            f.pop();
          } else {
            g.push(t[m]);
          }
        } else {
          g.push(t[m]);
        }
        if (s.structure[s.structure.length - 1][0] === "map" && f.length === 0 && (d(t[m + 1], 44) || d(t[m + 1], 41))) {
          if (d(t[m + 1], 41) && d(o.token[s.count], 40)) {
            s.pop(o);
            s.structure.pop();
            g.splice(0, 0, "(");
          } else {
            break;
          }
        }
        if (d(t[m + 1], 58)) {
          A = m;
          if (oe(t[A]))
            do {
              A = A - 1;
            } while (oe(t[A]));
          E = t.slice(A - 6, A + 1).join(C);
          if (E.indexOf("filter") === E.length - 6 || E.indexOf("progid") === E.length - 6) {
            E = "filter";
          }
        }
        if (f.length === 0) {
          if (d(t[m + 1], 59) && F(m + 1) === true || d(t[m + 1], 58) && X(t[m], 58) && X(t[m + 2], 58) && E !== "filter" && E !== "progid" || (d(t[m + 1], 125) || d(t[m + 1], 123)) || d(t[m + 1], 47) && (d(t[m + 2], 42) || d(t[m + 2], 47))) {
            A = g.length - 1;
            if (oe(g[A])) {
              do {
                A = A - 1;
                m = m - 1;
                g.pop();
              } while (oe(g[A]));
            }
            break;
          }
          if (d(t[m + 1], 44))
            break;
        }
        m = m + 1;
      } while (m < _);
    }
    b = m;
    if (s.structure[s.structure.length - 1][0] === "map" && d(g[0], 40)) {
      I[I.length - 1] = I[I.length - 1] - 1;
    }
    e = g.join(C).replace(/\s+/g, " ").replace(/^\s/, C).replace(/\s$/, C);
    if ($ === true) {
      e = e.replace(/\s+\(/g, "(").replace(/\s+\)/g, ")").replace(/,\(/g, ", (");
    }
    if (s.count > -1 && o.token[s.count].indexOf("extend(") === 0) {
      a = "pseudo";
    } else if ($ === true && /\d/.test(e.charAt(0)) === false && /^rgba?\(/.test(e) === false && e.indexOf("url(") !== 0 && (e.indexOf(" ") < 0 || e.indexOf(" ") > e.indexOf("(")) && e.charAt(e.length - 1) === ")") {
      if (d(o.token[s.count], 58)) {
        a = "value";
      } else {
        e = e.replace(/,\u0020?/g, ", ");
        a = "function";
      }
      e = i(e);
    } else if (s.count > -1 && `"'`.indexOf(o.token[s.count].charAt(0)) > -1 && o.types[s.count] === "variable") {
      a = "item";
    } else if (d(g[0], 64) || g[0] === "$") {
      if (o.types[s.count] === "colon" && h.language === "css" && (o.types[s.count - 1] === "property" || o.types[s.count - 1] === "variable")) {
        a = "value";
      } else if (s.count > -1) {
        a = "item";
        E = o.token[s.count];
        m = E.indexOf("(");
        if (d(E[E.length - 1], 41) && m > 0) {
          E = E.slice(m + 1, E.length - 1);
          o.token[s.count] = o.token[s.count].slice(0, m + 1) + i(E) + ")";
        }
      }
      e = i(e);
    } else {
      a = "item";
    }
    y(C);
  }
  function w(f) {
    let g = s.count;
    let x = 0;
    let m = C;
    const A = [];
    const E = () => {
      if (s.count < 0)
        return;
      if (g > 0 && (o.types[g] === "comment" || o.types[g] === "ignore")) {
        do {
          g = g - 1;
          A.push(o.token[g]);
        } while (g > 0 && o.lexer[g] === "style" && (o.types[g] === "comment" || o.types[g] === "ignore"));
      }
      x = g - 1;
      if (x > 0 && (o.types[x] === "comment" || o.types[x] === "ignore")) {
        do {
          x = x - 1;
        } while (x > 0 && o.lexer[g] === "style" && (o.types[x] === "comment" || o.types[x] === "ignore"));
      }
      if (x < 0)
        x = 0;
      if (g < 0)
        g = 0;
      m = o.token[g].charAt(0);
    };
    function $(q) {
      let R = q;
      const ee = o.begin[R];
      o.token[q] = o.token[q].replace(/\s*&/, " &").replace(/(\s*>\s*)/g, " > ").replace(/(\s*\+\s*)/g, " + ").replace(/:\s+/g, ": ").replace(/^(\s+)/, C).replace(/(\s+)$/, C).replace(/\s+::\s+/, "::");
      if (d(o.token[R - 1], 44) || d(o.token[R - 1], 58) || o.types[R - 1] === "comment" || o.types[R - 1] === "pseudo") {
        if (o.types[R - 1] === "pseudo") {
          o.token[R - 1] = `${o.token[R - 1]}${o.token[R]}`;
          o.types[R - 1] = "selector";
          s.splice({ data: o, howmany: 1, index: R });
        } else {
          do {
            R = R - 1;
            if (o.begin[R] === ee) {
              if (d(o.token[R], 59) || o.types[R].indexOf("template") > -1)
                break;
              if (X(o.token[R], 44) && o.types[R] !== "comment") {
                o.types[R] = "selector";
              }
              if (d(o.token[R], 58)) {
                if (X(o.token[R - 1], 58) && o.stack[g] === "global" && (o.types[R - 1] === "comment" || o.types[R - 1] === "ignore" || o.types[R - 1].indexOf("template") > -1)) {
                  o.token[R] = `${o.token[R]}${o.token[R + 1]}`;
                  s.pop(o);
                } else if (s.count === 1) {
                  o.token[R] = `${o.token[R]}${o.token[R + 1]}`;
                  s.pop(o);
                } else if (o.types[R] === "selector" && o.types[R + 1] === "item") {
                  o.token[R] = `${o.token[R]}${o.token[R + 1]}`;
                  s.pop(o);
                } else {
                  o.token[R] = `${o.token[R - 1]}:${o.token[R + 1]}`;
                  o.lines[R] = o.lines[R - 1];
                  s.splice({ data: o, howmany: 2, index: R });
                }
              }
            } else {
              break;
            }
          } while (R > 0);
        }
      }
      R = s.count;
      if (n.sortSelectors === true && d(o.token[R - 1], 44)) {
        const z = [o.token[R]];
        do {
          R = R - 1;
          if (o.types[R] === "comment" || o.types[R] === "ignore") {
            do {
              R = R - 1;
            } while (R > 0 && (o.types[R] === "comment" || o.types[R] === "ignore"));
          }
          if (d(o.token[R], 44))
            R = R - 1;
          z.push(o.token[R]);
        } while (R > 0 && (d(o.token[R - 1], 44) || o.types[R - 1] === "selector" || o.types[R - 1] === "comment" || o.types[R - 1] === "ignore"));
        z.sort();
        R = s.count;
        o.token[R] = z.pop();
        do {
          R = R - 1;
          if (o.types[R] === "comment" || o.types[R] === "ignore") {
            do {
              R = R - 1;
            } while (R > 0 && (o.types[R] === "comment" || o.types[R] === "ignore"));
          }
          if (d(o.token[R], 44))
            R = R - 1;
          o.token[R] = z.pop();
        } while (R > 0 && (d(o.token[R - 1], 44) || o.token[R - 1] === "selector" || o.types[R - 1] === "comment" || o.types[R - 1] === "ignore"));
      }
      g = s.count;
      E();
    }
    E();
    if (f === "start" && (o.types[g] === "value" || o.types[g] === "variable")) {
      o.types[g] = "item";
    }
    if (o.lexer[s.count - 1] !== "style" || x < 0) {
      if (f === "colon") {
        if (m === "$" || d(m, 64)) {
          o.types[g] = "variable";
        } else {
          if (o.stack[g] !== "global" && (o.types[g] !== "comment" || o.types[g] !== "ignore")) {
            o.types[g] = "property";
          }
        }
      } else if (o.lexer[g] === "style") {
        o.types[g] = "selector";
        $(g);
      }
    } else if (f === "start" && o.types[g] === "function" && o.lexer[g] === "style") {
      o.types[g] = "selector";
      $(g);
    } else if (o.types[g] === "item" && o.lexer[g] === "style") {
      if (f === "start") {
        $(g);
        o.types[g] = "selector";
        if (d(o.token[g], 58))
          o.types[x] = "selector";
        if (o.token[g].indexOf("=\u201C") > 0) {
          s.error = `Invalid Quote (\u201C, \\201c) used on line number ${s.lineNumber}`;
        } else if (o.token[g].indexOf("=\u201D") > 0) {
          s.error = `Invalid Quote (\u201D, \\201d) used on line number ${s.lineNumber}`;
        }
      } else if (f === "end") {
        if (m === "$" || d(m, 64)) {
          o.types[g] = "variable";
        } else {
          o.types[g] = "value";
        }
        o.token[g] = i(o.token[g]);
      } else if (f === "separator") {
        if (o.types[x] === "colon" || d(o.token[x], 44) || d(o.token[x], 123)) {
          if (X(t[b], 59) && (o.types[x] === "selector" || d(o.token[x], 123))) {
            o.types[g] = "selector";
            $(g);
          } else if (o.token[g].charAt(0) === "$" || d(o.token[g], 64)) {
            o.types[g] = "variable";
          } else {
            o.types[g] = "value";
          }
          o.token[g] = i(o.token[g]);
          if (o.token[g].charAt(0) === "\u201C") {
            s.error = `Invalid Quote (\u201C, \\201c) used on line number ${s.lineNumber}`;
          } else if (o.token[g].charAt(0) === "\u201D") {
            s.error = `Invalid (\u201D, \\201d) used on line number ${s.lineNumber}`;
          }
        } else {
          if (m === "$" || d(m, 64)) {
            o.types[g] = "variable";
          } else if (o.types[x] === "value" || o.types[x] === "variable") {
            o.token[x] = o.token[x] + o.token[g];
            s.pop(o);
          } else {
            o.types[g] = "value";
          }
        }
      } else if (f === "colon") {
        if (m === "$" || d(m, 64)) {
          o.types[g] = "variable";
        } else {
          o.types[g] = "property";
        }
      } else if (d(o.token[x], 64) && (o.types[x - 2] !== "variable" && o.types[x - 2] !== "property" || o.types[x - 1] === "separator")) {
        o.types[x] = "variable";
        a = "variable";
        o.token[x] = i(o.token[x]);
      }
    }
  }
  function p() {
    let f = s.count;
    do {
      f = f - 1;
    } while (f > 0 && o.types[f] === "comment");
    if (o.token[f] === ";")
      return;
    s.splice({ data: o, howmany: 0, index: f + 1, record: { begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "style", lines: s.linesSpace, stack: s.structure[s.structure.length - 1][0], token: ";", types: "separator" } });
  }
  function P(f, g) {
    const x = [];
    let m = C;
    let A = C;
    let E = 0;
    let $ = f.length;
    const q = (R) => {
      const ee = o.types[s.count - 1];
      if (a === "item") {
        if (ee === "colon") {
          o.types[s.count] = "value";
        } else {
          w(ee);
        }
      }
      a = R;
      if (a.indexOf("start") > -1 || a.indexOf("else") > -1) {
        y(e);
      } else {
        y(C);
      }
    };
    S[S.length - 1] = true;
    if (b < _) {
      do {
        x.push(t[b]);
        if (m === C) {
          if (t[b] === '"') {
            m = '"';
          } else if (t[b] === "'") {
            m = "'";
          } else if (t[b] === "/") {
            if (t[b + 1] === "/") {
              m = "/";
            } else if (t[b + 1] === "*") {
              m = "*";
            }
          } else if (t[b + 1] === g.charAt(0)) {
            do {
              E = E + 1;
              b = b + 1;
              x.push(t[b]);
            } while (b < _ && E < g.length && t[b + 1] === g.charAt(E));
            if (E === g.length) {
              m = x.join(C);
              if (oe(m.charAt($))) {
                do {
                  $ = $ + 1;
                } while (oe(m.charAt($)));
              }
              E = $;
              do {
                E = E + 1;
              } while (E < g.length && !oe(m.charAt(E)));
              if (E === m.length)
                E = E - g.length;
              if (f === "{%") {
                if (m.indexOf("{%-") === 0) {
                  m = m.replace(/^({%-\s*)/, "{%- ").replace(/(\s*-%})$/, " -%}").replace(/(\s*%})$/, " %}");
                  A = m.slice(4);
                } else {
                  m = m.replace(/^({%\s*)/, "{% ").replace(/(\s*%})$/, " %}").replace(/(\s*-%})$/, " -%}");
                  A = m.slice(3);
                }
              }
              if (f === "{{") {
                m = m.replace(/^({{\s*)/, "{{ ").replace(/^({{-\s*)/, "{{- ").replace(/(\s*-}})$/, " -}}").replace(/(\s*}})$/, " }}");
              }
              if (a === "item" && o.types[s.count - 1] === "colon" && (o.types[s.count - 2] === "property" || o.types[s.count - 2] === "variable")) {
                a = "value";
                o.types[s.count] = "value";
                if (Number.isNaN(Number(o.token[s.count])) === true && o.token[s.count].charAt(o.token[s.count].length - 1) !== ")") {
                  o.token[s.count] = o.token[s.count] + m;
                } else {
                  o.token[s.count] = o.token[s.count] + " " + m;
                }
                return;
              }
              e = m;
              if (f === "{%") {
                const R = ["autoescape", "block", "capture", "case", "comment", "embed", "filter", "for", "form", "if", "macro", "paginate", "raw", "sandbox", "spaceless", "tablerow", "unless", "verbatim"];
                let ee = R.length - 1;
                A = A.slice(0, A.indexOf(" "));
                if (A.indexOf("(") > 0) {
                  A = A.slice(0, A.indexOf("("));
                }
                if (A === "else" || A === "elseif" || A === "when" || A === "elsif") {
                  q("template_else");
                  return;
                }
                ee = R.length - 1;
                if (ee > -1) {
                  do {
                    if (A === R[ee]) {
                      q("template_start");
                      return;
                    }
                    if (A === "end" + R[ee]) {
                      q("template_end");
                      return;
                    }
                    ee = ee - 1;
                  } while (ee > -1);
                }
              } else if (f === "{{") {
                let R = m.slice(2);
                const ee = R.length;
                let z = 0;
                do {
                  z = z + 1;
                } while (z < ee && oe(R.charAt(z)) === false && R.charCodeAt($) !== 40);
                R = R.slice(0, z);
                if (R.charAt(R.length - 2) === "}") {
                  R = R.slice(0, R.length - 2);
                }
                if (R === "end") {
                  q("template_end");
                  return;
                }
                if (R === "block" || R === "define" || R === "form" || R === "if" || R === "range" || R === "with") {
                  q("template_start");
                  return;
                }
              }
              q("template");
              return;
            }
            E = 0;
          }
        } else if (m === t[b]) {
          if (d(m, 34) || d(m, 39)) {
            m = C;
          } else if (d(m, 47) && (t[b] === "\r" || d(t[b], 10))) {
            m = C;
          } else if (d(m, 42) && d(t[b + 1], 47)) {
            m = C;
          }
        }
        b = b + 1;
      } while (b < _);
    }
  }
  function U(f) {
    let g;
    if (f) {
      g = s.wrapCommentLine({ chars: t, end: _, lexer: "style", opening: "//", start: b, terminator: "\n" });
      e = g[0];
      a = /^(\/\/\s*@prettify-ignore-start)/.test(e) ? "ignore" : "comment";
    } else {
      g = s.wrapCommentBlock({ chars: t, end: _, lexer: "style", opening: "/*", start: b, terminator: "*/" });
      e = g[0];
      a = /^(\/\*\s*@prettify-ignore-start)/.test(e) ? "ignore" : "comment";
    }
    y(C);
    b = g[1];
  }
  function V() {
    const f = s.linesSpace;
    const g = xe(null);
    g.data = xe(null);
    g.data.margin = [C, C, C, C, false];
    g.data.padding = [C, C, C, C, false];
    g.last = xe(null);
    g.last.margin = 0;
    g.last.padding = 0;
    g.removes = [];
    const x = s.structure[s.structure.length - 1][1];
    function m(q) {
      if (o.token[E - 2] === q) {
        const R = o.token[E].replace(/\s*!important\s*/g, C).split(" ");
        const ee = R.length;
        if (o.token[E].indexOf("!important") > -1)
          g.data[q[4]] = true;
        if (ee > 3) {
          if (g.data[q][0] === C)
            g.data[q][0] = R[0];
          if (g.data[q][1] === C)
            g.data[q][1] = R[1];
          if (g.data[q][2] === C)
            g.data[q][2] = R[2];
          if (g.data[q][3] === C)
            g.data[q][3] = R[3];
        } else if (ee > 2) {
          if (g.data[q][0] === C)
            g.data[q][0] = R[0];
          if (g.data[q][1] === C)
            g.data[q][1] = R[1];
          if (g.data[q][2] === C)
            g.data[q][2] = R[2];
          if (g.data[q][3] === C)
            g.data[q][3] = R[1];
        } else if (ee > 1) {
          if (g.data[q][0] === C)
            g.data[q][0] = R[0];
          if (g.data[q][1] === C)
            g.data[q][1] = R[1];
          if (g.data[q][2] === C)
            g.data[q][2] = R[0];
          if (g.data[q][3] === C)
            g.data[q][3] = R[1];
        } else {
          if (g.data[q][0] === C)
            g.data[q][0] = R[0];
          if (g.data[q][1] === C)
            g.data[q][1] = R[0];
          if (g.data[q][2] === C)
            g.data[q][2] = R[0];
          if (g.data[q][3] === C)
            g.data[q][3] = R[0];
        }
      } else if (o.token[E - 2] === `${q}-bottom`) {
        if (g.data[q][2] === C)
          g.data[q][2] = o.token[E];
      } else if (o.token[E - 2] === `${q}-left`) {
        if (g.data[q][3] === C)
          g.data[q][3] = o.token[E];
      } else if (o.token[E - 2] === `${q}-right`) {
        if (g.data[q][1] === C)
          g.data[q][1] = o.token[E];
      } else if (o.token[E - 2] === `${q}-top`) {
        if (g.data[q][0] === C)
          g.data[q][0] = o.token[E];
      } else {
        return;
      }
      g.removes.push([E, q]);
      g.last[q] = E;
    }
    function A() {
      let q = 0;
      let R = C;
      const ee = /^(0+([a-z]+|%))/;
      const z = g.removes.length;
      const G = g.data.margin[0] !== C && g.data.margin[1] !== C && g.data.margin[2] !== C && g.data.margin[3] !== C;
      const Z = g.data.padding[0] !== C && g.data.padding[1] !== C && g.data.padding[2] !== C && g.data.padding[3] !== C;
      function te(Q) {
        if (ee.test(g.data[Q][0]) === true)
          g.data[Q][0] = "0";
        if (ee.test(g.data[Q][1]) === true)
          g.data[Q][1] = "0";
        if (ee.test(g.data[Q][2]) === true)
          g.data[Q][2] = "0";
        if (ee.test(g.data[Q][3]) === true)
          g.data[Q][3] = "0";
        if (g.data[Q][0] === g.data[Q][1] && g.data[Q][0] === g.data[Q][2] && g.data[Q][0] === g.data[Q][3]) {
          R = g.data[Q][0];
        } else if (g.data[Q][0] === g.data[Q][2] && g.data[Q][1] === g.data[Q][3] && g.data[Q][0] !== g.data[Q][1]) {
          R = `${g.data[Q][0]} ${g.data[Q][1]}`;
        } else if (g.data[Q][1] === g.data[Q][3] && g.data[Q][0] !== g.data[Q][2]) {
          R = `${g.data[Q][0]} ${g.data[Q][1]} ${g.data[Q][2]}`;
        } else {
          R = `${g.data[Q][0]} ${g.data[Q][1]} ${g.data[Q][2]} ${g.data[Q][3]}`;
        }
        if (g.data[Q[4]] === true)
          R = `${R.replace(" !important", C)} !important`;
        if (g.last[Q] > s.count) {
          q = x < 1 ? 1 : x + 1;
          do {
            if (o.begin[q] === x && o.types[q] === "value" && o.token[q - 2].indexOf(Q) === 0) {
              g.last[Q] = q;
              break;
            }
            q = q + 1;
          } while (q < s.count);
        }
        o.token[g.last[Q]] = R;
        o.token[g.last[Q] - 2] = Q;
      }
      if (z > 1 && (G === true || Z === true)) {
        do {
          if (g.removes[q][0] !== g.last.margin && g.removes[q][0] !== g.last.padding && (G === true && g.removes[q][1] === "margin" || Z === true && g.removes[q][1] === "padding")) {
            s.splice({ data: o, howmany: o.types[g.removes[q][0] + 1] === "separator" ? 4 : 3, index: g.removes[q][0] - 2 });
          }
          q = q + 1;
        } while (q < z - 1);
      }
      if (G === true)
        te("margin");
      if (Z === true)
        te("padding");
      if ($ === true) {
        if (x < 0) {
          s.error = "Brace mismatch. There appears to be more closing braces than starting braces.";
        } else {
          s.sortCorrection(x, s.count + 1);
        }
      }
    }
    let E = s.count;
    let $ = false;
    do {
      E = E - 1;
      if (o.begin[E] === x) {
        if (o.types[E] === "value" && o.types[E - 2] === "property") {
          if (o.token[E - 2].indexOf("margin") === 0) {
            m("margin");
          } else if (o.token[E - 2].indexOf("padding") === 0) {
            m("padding");
          }
        }
      } else {
        $ = true;
        E = o.begin[E];
      }
    } while (E > x);
    A();
    s.linesSpace = f;
  }
  do {
    if (oe(t[b])) {
      b = s.spacer({ array: t, end: _, index: b });
    } else if (d(t[b], 47) && d(t[b + 1], 42)) {
      U(false);
    } else if (d(t[b], 47) && d(t[b + 1], 47)) {
      U(true);
    } else if (d(t[b], 123) && d(t[b + 1], 37)) {
      P("{%", "%}");
    } else if (d(t[b], 123) && d(t[b + 1], 123)) {
      P("{{", "}}");
    } else if (d(t[b], 123) || d(t[b], 40) && d(o.token[s.count], 58) && o.types[s.count - 1] === "variable") {
      w("start");
      a = "start";
      e = t[b];
      if (d(t[b], 40)) {
        y("map");
        I.push(0);
      } else if (o.types[s.count] === "selector" || o.types[s.count] === "variable") {
        y(o.token[s.count]);
      } else if (o.types[s.count] === "colon") {
        y(o.token[s.count - 1]);
      } else {
        y("block");
      }
      S.push(false);
    } else if (d(t[b], 125) || t[b] === ")" && s.structure[s.structure.length - 1][0] === "map" && I[I.length - 1] === 0) {
      if (d(t[b], 125) && d(o.token[s.count - 1], 123) && o.types[s.count] === "item" && o.token[s.count - 2] !== void 0 && o.token[s.count - 2].charAt(o.token[s.count - 2].length - 1) === "@") {
        o.token[s.count - 2] = o.token[s.count - 2] + "{" + o.token[s.count] + "}";
        s.pop(o);
        s.pop(o);
        s.structure.pop();
      } else {
        if (d(t[b], 41))
          I.pop();
        w("end");
        if (d(t[b], 125) && X(o.token[s.count], 59)) {
          if (o.types[s.count] === "value" || o.types[s.count] === "function" || o.types[s.count] === "variable" && (d(o.token[s.count - 1], 58) || d(o.token[s.count - 1], 59))) {
            if (n.correct === true) {
              e = ";";
            } else {
              e = "x;";
            }
            a = "separator";
            y(C);
          } else if (o.types[s.count] === "comment") {
            p();
          }
        }
        S.pop();
        e = t[b];
        a = "end";
        if (d(t[b], 125))
          V();
        if (n.sortProperties === true && d(t[b], 125))
          s.objectSort(o);
        y(C);
      }
    } else if (d(t[b], 59) || d(t[b], 44)) {
      if (o.types[s.count - 1] === "selector" || o.types[s.count] !== "function" && d(o.token[s.count - 1], 125)) {
        w("start");
      } else {
        w("separator");
      }
      if (o.types[s.count] !== "separator" && F(b) === true) {
        e = t[b];
        a = "separator";
        y(C);
      }
    } else if (d(t[b], 58) && o.types[s.count] !== "end") {
      if (d(t[b + 1], 58)) {
        b = b + 1;
        w("pseudo");
        e = "::";
        a = "pseudo";
        y(C);
      } else {
        w("colon");
        e = ":";
        a = "colon";
        y(C);
      }
    } else {
      if (s.structure[s.structure.length - 1][0] === "map" && d(t[b], 40)) {
        I[I.length - 1] = I[I.length - 1] + 1;
      }
      N();
    }
    b = b + 1;
  } while (b < _);
  if (n.sortProperties === true)
    s.objectSort(o);
  return o;
};
T.lexers.script = function l2(c) {
  const { options: h } = T;
  if (h.language === "json")
    h.script.quoteConvert = "double";
  let n = 0;
  let o = "";
  let t = "";
  let _ = [];
  let I = 0;
  let S = -1;
  let b = -1;
  let a = [];
  let e;
  let y;
  let F;
  const { data: i } = s;
  const { references: N } = s;
  const w = c.length;
  const p = c.split("");
  const P = [];
  const U = [];
  const V = [];
  const f = [0, ""];
  const g = [false];
  const x = ["autoescape", "block", "capture", "case", "comment", "embed", "filter", "for", "form", "if", "macro", "paginate", "raw", "sandbox", "spaceless", "tablerow", "unless", "verbatim"];
  const m = xe(null);
  m.count = [];
  m.index = [];
  m.len = -1;
  m.word = [];
  function A(u) {
    let r = 0;
    const k = Q(1, false);
    const v = s.structure.length === 0 ? "" : s.structure[s.structure.length - 1][0];
    const O = xe(null);
    O.begin = i.begin[s.count];
    O.ender = i.begin[s.count];
    O.lexer = i.lexer[s.count];
    O.lines = i.lines[s.count];
    O.stack = i.stack[s.count];
    O.token = i.token[s.count];
    O.types = i.types[s.count];
    if (/^(\/(\/|\*)\s*@prettify-ignore-start)/.test(o))
      return;
    if (t === "start" || t === "type_start")
      return;
    if (h.language === "json")
      return;
    if (d(O.token, 59) || d(O.token, 44) || O.stack === "class" || O.stack === "map" || O.stack === "attribute" || i.types[O.begin - 1] === "generic" || k === "{" || v === "initializer") {
      return;
    }
    if (d(O.token, 125) && i.stack[O.begin - 1] === "global" && i.types[O.begin - 1] !== "operator" && O.stack === i.stack[s.count - 1]) {
      return;
    }
    if (O.stack === "array" && O.token !== "]")
      return;
    if (i.token[i.begin[s.count]] === "{" && O.stack === "data_type")
      return;
    if (O.types !== void 0 && O.types.indexOf("template") > -1 && O.types.indexOf("template_string") < 0) {
      return;
    }
    if (d(k, 59) && u === false)
      return;
    if (i.lexer[s.count - 1] !== "script" && (n < w && w === T.source.length - 1 || w < T.source.length - 1)) {
      return;
    }
    if (d(O.token, 125) && (O.stack === "function" || O.stack === "if" || O.stack === "else" || O.stack === "for" || O.stack === "do" || O.stack === "while" || O.stack === "switch" || O.stack === "class" || O.stack === "try" || O.stack === "catch" || O.stack === "finally" || O.stack === "block")) {
      if (O.stack === "function" && (i.stack[O.begin - 1] === "data_type" || i.types[O.begin - 1] === "type")) {
        r = O.begin;
        do {
          r = r - 1;
        } while (r > 0 && i.token[r] !== ")" && i.stack[r] !== "arguments");
        r = i.begin[r];
      } else {
        r = i.begin[O.begin - 1];
      }
      if (d(i.token[r], 40)) {
        r = r - 1;
        if (i.token[r - 1] === "function")
          r = r - 1;
        if (i.stack[r - 1] === "object" || i.stack[r - 1] === "switch")
          return;
        if (i.token[r - 1] !== "=" && i.token[r - 1] !== "return" && i.token[r - 1] !== ":") {
          return;
        }
      } else {
        return;
      }
    }
    if (O.types === "comment" || v === "method" || v === "paren" || v === "expression" || v === "array" || v === "object" || v === "switch" && O.stack !== "method" && i.token[i.begin[s.count]] === "(" && i.token[i.begin[s.count] - 1] !== "return" && i.types[i.begin[s.count] - 1] !== "operator") {
      return;
    }
    if (i.stack[s.count] === "expression" && (i.token[i.begin[s.count] - 1] !== "while" || i.token[i.begin[s.count] - 1] === "while" && i.stack[i.begin[s.count] - 2] !== "do")) {
      return;
    }
    if (k !== "" && "=<>+*?|^:&%~,.()]".indexOf(k) > -1 && u === false)
      return;
    if (O.types === "comment") {
      r = s.count;
      do {
        r = r - 1;
      } while (r > 0 && i.types[r] === "comment");
      if (r < 1)
        return;
      O.token = i.token[r];
      O.types = i.types[r];
      O.stack = i.stack[r];
    }
    if (O.token === void 0 || O.types === "start" || O.types === "separator" || O.types === "operator" && O.token !== "++" && O.token !== "--" || O.token === "x}" || O.token === "var" || O.token === "let" || O.token === "const" || O.token === "else" || O.token.indexOf("#!/") === 0 || O.token === "instanceof") {
      return;
    }
    if (O.stack === "method" && (i.token[O.begin - 1] === "function" || i.token[O.begin - 2] === "function")) {
      return;
    }
    if (h.script.variableList === "list")
      m.index[m.len] = s.count;
    o = h.script.correct === true ? ";" : "x;";
    t = "separator";
    r = s.linesSpace;
    s.linesSpace = 0;
    H("");
    s.linesSpace = r;
    R();
  }
  function E() {
    let u = s.count;
    do {
      u = u - 1;
    } while (u > -1 && i.token[u] === "x}");
    if (i.stack[u] === "else")
      return H("");
    u = u + 1;
    s.splice({ data: i, howmany: 0, index: u, record: { begin: i.begin[u], ender: -1, lexer: "script", lines: s.linesSpace, stack: i.stack[u], token: o, types: t } });
    H("");
  }
  function $() {
    let u = s.count;
    if (i.types[u] === "comment") {
      do {
        u = u - 1;
      } while (u > 0 && i.types[u] === "comment");
    }
    if (i.token[u] === "from")
      u = u - 2;
    if (i.token[u] === "x;") {
      s.splice({ data: i, howmany: 1, index: u });
    }
  }
  function q() {
    A(false);
    if (S > -1)
      j();
    F = s.wrapCommentBlock({ chars: p, end: w, lexer: "script", opening: "/*", start: n, terminator: "*/" });
    n = F[1];
    if (i.token[s.count] === "var" || i.token[s.count] === "let" || i.token[s.count] === "const") {
      e = s.pop(i);
      H("");
      s.push(i, e, "");
      if (i.lines[s.count - 2] === 0)
        i.lines[s.count - 2] = i.lines[s.count];
      i.lines[s.count] = 0;
    } else if (F[0] !== "") {
      o = F[0];
      t = /^\/\*\s*@ignore\s*\bstart\b/.test(o) ? "ignore" : "comment";
      if (o.indexOf("# sourceMappingURL=") === 2) {
        f[0] = s.count + 1;
        f[1] = o;
      }
      s.push(i, { begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "script", lines: s.linesSpace, stack: s.structure[s.structure.length - 1][0], token: o, types: t }, "");
    }
    if (/\/\*\s*global\s+/.test(i.token[s.count]) === true && i.types.indexOf("word") < 0) {
      N[0] = i.token[s.count].replace(/\/\*\s*global\s+/, "").replace("*/", "").replace(/,\s+/g, ",").split(",");
    }
  }
  function R() {
    let u = "";
    const r = Q(5, false);
    const k = s.count;
    const v = s.linesSpace;
    if (h.language === "json" || U.length < 1 || U[U.length - 1].charAt(0) !== "x" || /^x?(;|\}|\))$/.test(o) === false) {
      return;
    }
    if (i.stack[s.count] === "do" && r === "while" && i.token[s.count] === "}") {
      return;
    }
    if (o === ";" && i.token[k - 1] === "x{") {
      u = i.token[i.begin[k - 2] - 1];
      if (i.token[k - 2] === "do" || i.token[k - 2] === ")" && "ifforwhilecatch".indexOf(u) > -1) {
        e = s.pop(i);
        o = h.script.correct === true ? "}" : "x}";
        t = "end";
        y = s.structure[s.structure.length - 1];
        H("");
        U.pop();
        s.linesSpace = v;
        return;
      }
      e = s.pop(i);
      o = h.script.correct === true ? "}" : "x}";
      t = "end";
      y = s.structure[s.structure.length - 1];
      H("");
      U.pop();
      o = ";";
      t = "end";
      s.push(i, e, "");
      s.linesSpace = v;
      return;
    }
    o = h.script.correct === true ? "}" : "x}";
    t = "end";
    if (i.token[s.count] === "x}")
      return;
    if (i.stack[s.count] === "if" && (i.token[s.count] === ";" || i.token[s.count] === "x;") && r === "else") {
      y = s.structure[s.structure.length - 1];
      H("");
      U.pop();
      s.linesSpace = v;
      return;
    }
    do {
      y = s.structure[s.structure.length - 1];
      H("");
      U.pop();
      if (i.stack[s.count] === "do")
        break;
    } while (U[U.length - 1] === "x{");
    s.linesSpace = v;
  }
  function ee() {
    let u = s.count;
    if (i.stack[u] === "object" && h.script.objectSort === true) {
      o = ",";
      t = "separator";
      $();
      H("");
    } else {
      do {
        u = u - 1;
      } while (u > 0 && i.types[u - 1] === "comment");
      s.splice({ data: i, howmany: 0, index: u, record: { begin: i.begin[u], ender: -1, lexer: "script", lines: s.linesSpace, stack: i.stack[u], token: ",", types: "separator" } });
      H("");
    }
  }
  function z(u) {
    let r = false;
    let k = false;
    const v = Q(1, false);
    const O = i.token[s.count] === "(" ? s.count : i.begin[s.count];
    function M() {
      let L = 0;
      const W = i.token[O - 1] === "Array";
      const ie = W === true ? "[" : "{";
      const D = W === true ? "]" : "}";
      const Y = W === true ? "array" : "object";
      if (W === true && i.types[s.count] === "number") {
        L = Number(i.token[s.count]);
        e = s.pop(i);
      }
      e = s.pop(i);
      e = s.pop(i);
      e = s.pop(i);
      s.structure.pop();
      o = ie;
      t = "start";
      H(Y);
      if (L > 0) {
        o = ",";
        t = "separator";
        do {
          H("");
          L = L - 1;
        } while (L > 0);
      }
      o = D;
      t = "end";
      H("");
    }
    if (S > -1)
      j();
    if (V.length > 0) {
      if (V[V.length - 1] === 0) {
        V.pop();
      } else {
        V[V.length - 1] = V[V.length - 1] - 1;
      }
    }
    if (d(u, 41) || u === "x)" || d(u, 93)) {
      if (h.script.correct === true)
        B();
      $();
    }
    if (d(u, 41) || u === "x)")
      A(false);
    if (m.len > -1) {
      if (d(u, 125) && (h.script.variableList === "list" && m.count[m.len] === 0 || i.token[s.count] === "x;" && h.script.variableList === "each")) {
        Re();
      }
      m.count[m.len] = m.count[m.len] - 1;
      if (m.count[m.len] < 0)
        Re();
    }
    if (d(o, 44) && i.stack[s.count] !== "initializer" && (d(u, 93) && d(i.token[s.count - 1], 91) || d(u, 125))) {
      e = s.pop(i);
    }
    if (d(u, 41) || u === "x)") {
      o = u;
      if (P.length > 0) {
        _ = P[P.length - 1];
        if (_.length > 1 && X(v, 123) && (_[0] === "if" || _[0] === "for" || _[0] === "with" || _[0] === "while" && i.stack[_[1] - 2] !== void 0 && i.stack[_[1] - 2] !== "do")) {
          r = true;
        }
      }
    } else if (d(u, 93)) {
      o = "]";
    } else if (d(u, 125)) {
      if (X(o, 44) && h.script.correct === true)
        B();
      if (s.structure.length > 0 && s.structure[s.structure.length - 1][0] !== "object")
        A(true);
      if ((h.script.objectSort === true || h.language === "json" && h.json.objectSort === true) && s.structure[s.structure.length - 1][0] === "object") {
        s.objectSort(i);
      }
      if (t === "comment") {
        o = i.token[s.count];
        t = i.types[s.count];
      }
      o = "}";
    }
    if (s.structure[s.structure.length - 1][0] === "data_type") {
      t = "type_end";
    } else {
      t = "end";
    }
    P.pop();
    y = s.structure[s.structure.length - 1];
    if (d(u, 41) && h.script.correct === true && O - s.count < 2 && (d(i.token[s.count], 40) || i.types[s.count] === "number") && (i.token[O - 1] === "Array" || i.token[O - 1] === "Object") && i.token[O - 2] === "new") {
      M();
      k = true;
    }
    if (U[U.length - 1] === "x{" && d(u, 125)) {
      R();
      U.pop();
      if (i.stack[s.count] !== "try") {
        if (X(v, 58) && X(v, 59) && i.token[i.begin[n] - 1] !== "?")
          R();
      }
      o = "}";
    } else {
      U.pop();
    }
    if (h.script.endComma !== void 0 && h.script.endComma !== "none" && s.structure[s.structure.length - 1][0] === "array" || s.structure[s.structure.length - 1][0] === "object" || s.structure[s.structure.length - 1][0] === "data_type") {
      if (h.script.endComma === "always" && i.token[s.count] !== ",") {
        const L = s.structure[s.structure.length - 1][1];
        let W = s.count;
        do {
          if (i.begin[W] === L) {
            if (d(i.token[W], 44))
              break;
          } else {
            W = i.begin[W];
          }
          W = W - 1;
        } while (W > L);
        if (W > L) {
          const ie = t;
          const D = o;
          o = ",";
          t = "separator";
          H("");
          o = D;
          t = ie;
        }
      } else if (h.script.endComma === "never" && d(i.token[s.count], 44)) {
        s.pop(i);
      }
    }
    if (k === false) {
      H("");
      if (o === "}" && i.stack[s.count] !== "object" && i.stack[s.count] !== "class" && i.stack[s.count] !== "data_type") {
        N.pop();
        R();
      }
    }
    if (r === true) {
      o = h.script.correct === true ? "{" : "x{";
      t = "start";
      H(_[0]);
      U.push("x{");
      _[1] = s.count;
    }
    g.pop();
    if (s.structure[s.structure.length - 1][0] !== "data_type")
      g[g.length - 1] = false;
  }
  function G(u, r, k) {
    let v = 0;
    let O = false;
    let M = false;
    let L = [u];
    let W;
    const ie = r.split(C);
    const D = ie.length;
    const Y = n;
    const se = n + u.length;
    const re = h.script.quoteConvert === void 0 ? "none" : h.script.quoteConvert;
    function J() {
      let ue = 0;
      L = [];
      t = k;
      v = n;
      if (k === "string" && /\s/.test(p[v + 1]) === true) {
        ue = 1;
        do {
          v = v + 1;
          if (p[v] === "\n")
            ue = ue + 1;
        } while (v < w && /\s/.test(p[v + 1]) === true);
        s.linesSpace = ue;
      }
    }
    function K() {
      let ue = C;
      function be(ae) {
        if (h.language !== "javascript" && h.language !== "typescript" && h.language !== "jsx" && h.language !== "tsx") {
          const de = (fe) => fe.replace(/\s*$/, " ");
          const ce = (fe) => fe.replace(/^\s*/, " ");
          if (/\{(#|\/|(%>)|(%\]))/.test(ae) || /\}%(>|\])/.test(ae))
            return ae;
          ae = ae.replace(/\{((\{+)|%-?)\s*/g, de);
          ae = ae.replace(/\s*((\}\}+)|(-?%\}))/g, ce);
          return ae;
        }
        return ae;
      }
      if (d(u, 34) && re === "single") {
        L[0] = "'";
        L[L.length - 1] = "'";
      } else if (d(u, 39) && re === "double") {
        L[0] = '"';
        L[L.length - 1] = '"';
      } else if (O === true) {
        ue = L[L.length - 1];
        L.pop();
        L.pop();
        L.push(ue);
      }
      n = v;
      if (r === "\n") {
        n = n - 1;
        L.pop();
      }
      o = L.join(C);
      if (d(u, 34) || d(u, 39) || u === "{{" || u === "{%") {
        o = be(o);
      }
      if (u === "{%" || u === "{{") {
        W = $e(o);
        t = W[0];
        H(W[1]);
        return;
      }
      if (k === "string") {
        t = "string";
        if (h.language === "json") {
          o = o.replace(/\u0000/g, "\\u0000").replace(/\u0001/g, "\\u0001").replace(/\u0002/g, "\\u0002").replace(/\u0003/g, "\\u0003").replace(/\u0004/g, "\\u0004").replace(/\u0005/g, "\\u0005").replace(/\u0006/g, "\\u0006").replace(/\u0007/g, "\\u0007").replace(/\u0008/g, "\\u0008").replace(/\u0009/g, "\\u0009").replace(/\u000a/g, "\\u000a").replace(/\u000b/g, "\\u000b").replace(/\u000c/g, "\\u000c").replace(/\u000d/g, "\\u000d").replace(/\u000e/g, "\\u000e").replace(/\u000f/g, "\\u000f").replace(/\u0010/g, "\\u0010").replace(/\u0011/g, "\\u0011").replace(/\u0012/g, "\\u0012").replace(/\u0013/g, "\\u0013").replace(/\u0014/g, "\\u0014").replace(/\u0015/g, "\\u0015").replace(/\u0016/g, "\\u0016").replace(/\u0017/g, "\\u0017").replace(/\u0018/g, "\\u0018").replace(/\u0019/g, "\\u0019").replace(/\u001a/g, "\\u001a").replace(/\u001b/g, "\\u001b").replace(/\u001c/g, "\\u001c").replace(/\u001d/g, "\\u001d").replace(/\u001e/g, "\\u001e").replace(/\u001f/g, "\\u001f");
        } else if (u.indexOf("#!") === 0) {
          o = o.slice(0, o.length - 1);
          s.linesSpace = 2;
        } else if (s.structure[s.structure.length - 1][0] !== "object" || s.structure[s.structure.length - 1][0] === "object" && Q(1, false) !== ":" && X(i.token[s.count], 44) && X(i.token[s.count], 123)) {
          if (o.length > h.wrap && h.wrap > 0 || h.wrap !== 0 && i.token[s.count] === "+" && (i.token[s.count - 1].charAt(0) === '"' || i.token[s.count - 1].charAt(0) === "'")) {
            let ae = o;
            let de = "";
            let ce = re === "double" ? '"' : re === "single" ? "'" : ae.charAt(0);
            const fe = h.wrap;
            const Oe = /u[0-9a-fA-F]{4}/;
            const Be = /x[0-9a-fA-F]{2}/;
            ae = ae.slice(1, ae.length - 1);
            if (i.token[s.count] === "+" && (i.token[s.count - 1].charAt(0) === '"' || i.token[s.count - 1].charAt(0) === "'")) {
              s.pop(i);
              ce = i.token[s.count].charAt(0);
              ae = i.token[s.count].slice(1, i.token[s.count].length - 1) + ae;
              s.pop(i);
            }
            if (ae.length > fe && fe > 0) {
              do {
                de = ae.slice(0, fe);
                if (de.charAt(fe - 5) === "\\" && Oe.test(ae.slice(fe - 4, fe + 1))) {
                  de = de.slice(0, fe - 5);
                } else if (de.charAt(fe - 4) === "\\" && Oe.test(ae.slice(fe - 3, fe + 2))) {
                  de = de.slice(0, fe - 4);
                } else if (de.charAt(fe - 3) === "\\" && (Oe.test(ae.slice(fe - 2, fe + 3)) || Be.test(ae.slice(fe - 2, fe + 1)))) {
                  de = de.slice(0, fe - 3);
                } else if (de.charAt(fe - 2) === "\\" && (Oe.test(ae.slice(fe - 1, fe + 4)) || Be.test(ae.slice(fe - 1, fe + 2)))) {
                  de = de.slice(0, fe - 2);
                } else if (de.charAt(fe - 1) === "\\") {
                  de = de.slice(0, fe - 1);
                }
                de = ce + de + ce;
                ae = ae.slice(de.length - 2);
                o = de;
                t = "string";
                H(C);
                s.linesSpace = 0;
                o = "+";
                t = "operator";
                H(C);
              } while (ae.length > fe);
            }
            if (ae === C) {
              o = ce + ce;
            } else {
              o = ce + ae + ce;
            }
            t = "string";
          }
        }
      } else if (/\{\s*\?>$/.test(o)) {
        t = "template_start";
      } else {
        t = k;
      }
      if (o.length > 0)
        H(C);
    }
    if (S > -1)
      j();
    if (p[n - 1] === "\\" && ye(n - 1) === true && (p[n] === '"' || p[n] === "'")) {
      s.pop(i);
      if (i.token[0] === "{") {
        if (p[n] === '"') {
          u = '"';
          r = '\\"';
          L = ['"'];
        } else {
          u = "'";
          r = "\\'";
          L = ["'"];
        }
        O = true;
      } else {
        if (p[n] === '"') {
          L = ['\\"'];
          K();
          return;
        }
        L = ["\\'"];
        K();
        return;
      }
    }
    v = se;
    if (v < w) {
      do {
        if (X(i.token[0], 123) && X(i.token[0], 91) && re !== "none" && (d(p[v], 34) || d(p[v], 39))) {
          if (p[v - 1] === "\\") {
            if (ye(v - 1) === true) {
              if (re === "double" && p[v] === "'") {
                L.pop();
              } else if (re === "single" && p[v] === '"') {
                L.pop();
              }
            }
          } else if (re === "double" && p[v] === '"' && p[n] === "'") {
            p[v] = '\\"';
          } else if (re === "single" && p[v] === "'" && p[n] === '"') {
            p[v] = "\\'";
          }
          L.push(p[v]);
        } else if (v > Y) {
          M = true;
          if (d(p[v], 123) && d(p[v + 1], 37) && p[v + 2] !== u) {
            K();
            G("{%", "%}", "template");
            J();
          } else if (d(p[v], 123) && d(p[v + 1], 123) && p[v + 2] !== u) {
            K();
            G("{{", "}}", "template");
            J();
          } else {
            M = false;
            L.push(p[v]);
          }
        } else {
          L.push(p[v]);
        }
        if ((d(u, 34) || d(u, 39)) && (M === true || v > Y) && h.language !== "json" && h.language !== "javascript" && p[v - 1] !== "\\" && X(p[v], 34) && X(p[v], 39) && (d(p[v], 10) || v === w - 1 === true)) {
          s.error = "Unterminated string in script on line number " + s.lineNumber;
          break;
        }
        if (p[v] === ie[D - 1] && (p[v - 1] !== "\\" || ye(v - 1) === false)) {
          if (D === 1)
            break;
          if (L[v - se] === ie[0] && L.slice(v - se - D + 2).join("") === r)
            break;
        }
        v = v + 1;
      } while (v < w);
    }
    K();
  }
  function Z() {
    A(false);
    R();
    if (S > -1)
      j();
    F = s.wrapCommentLine({ chars: p, end: w, lexer: "script", opening: "//", start: n, terminator: "\n" });
    n = F[1];
    if (F[0] !== "") {
      o = F[0];
      t = /^(\/\/\s*@prettify-ignore-start)/.test(o) ? "ignore" : "comment";
      if (o.indexOf("# sourceMappingURL=") === 2) {
        f[0] = s.count + 1;
        f[1] = o;
      }
      s.push(i, { begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "script", lines: s.linesSpace, stack: s.structure[s.structure.length - 1][0], token: o, types: t }, "");
    }
  }
  function te() {
    let u = 0;
    let r = false;
    let k = false;
    let v = 0;
    let O = 0;
    let M = 0;
    let L = "";
    let W = "";
    let ie = "";
    const D = [];
    const Y = g[g.length - 1];
    const se = "0123456789=<>+-*?|^:&.,;%(){}[]~";
    function re() {
      if (o === "(")
        s.structure[s.structure.length - 1] = ["paren", s.count];
      T.lexers.markup(D.join(""));
    }
    if (S > -1)
      j();
    W = s.count > 0 ? i.token[s.count - 1] : "";
    ie = s.count > 0 ? i.types[s.count - 1] : "";
    L = Q(1, false);
    if (h.language !== "jsx" && h.language !== "tsx" && /\d/.test(L) === false && (o === "function" || W === "=>" || W === "void" || W === "." || i.stack[s.count] === "arguments" || t === "type" && W === "type" || t === "reference" && (ie === "operator" || W === "function" || W === "class" || W === "new") || t === "type" && ie === "operator" || o === "return" || t === "operator")) {
      const J = [];
      let K = 0;
      let ue = 0;
      u = n;
      do {
        J.push(p[u]);
        if (p[u] === "<") {
          K = K + 1;
        } else if (p[u] === ">") {
          K = K - 1;
          if (K < 1)
            break;
        }
        u = u + 1;
      } while (u < w);
      ue = n;
      n = u;
      L = Q(1, false);
      if (p[u] === ">" && (Y === true || W === "=>" || W === "." || ie !== "operator" || ie === "operator" && (L === "(" || L === "="))) {
        t = "generic";
        o = J.join("").replace(/^<\s+/, "<").replace(/\s+>$/, ">").replace(/,\s*/g, ", ");
        H("");
        return;
      }
      n = ue;
    }
    u = s.count;
    if (i.types[u] === "comment") {
      do {
        u = u - 1;
      } while (u > 0 && i.types[u] === "comment");
    }
    if (Y === false && Q(1, false) !== ">" && (p[n] !== "<" && se.indexOf(p[n + 1]) > -1 || i.token[u] === "++" || i.token[u] === "--" || /\s/.test(p[n + 1]) === true || /\d/.test(p[n + 1]) === true && (t === "operator" || t === "string" || t === "number" || t === "reference" || t === "word" && o !== "return"))) {
      t = "operator";
      o = ke();
      return H("");
    }
    if (h.language !== "typescript" && (i.token[u] === "return" || i.types[u] === "operator" || i.types[u] === "start" || i.types[u] === "separator" || i.types[u] === "jsx_attribute_start" || i.token[u] === "}" && s.structure[s.structure.length - 1][0] === "global")) {
      t = "markup";
      h.language = "jsx";
      do {
        D.push(p[n]);
        if (p[n] === "{") {
          O = O + 1;
          r = true;
        } else if (p[n] === "}") {
          O = O - 1;
          if (O === 0)
            r = false;
        } else if (p[n] === "<" && r === false) {
          if (p[n + 1] === "<") {
            do {
              D.push(p[n]);
              n = n + 1;
            } while (n < w && p[n + 1] === "<");
          }
          v = v + 1;
          if (Q(1, false) === "/")
            k = true;
        } else if (p[n] === ">" && r === false) {
          if (p[n + 1] === ">") {
            do {
              D.push(p[n]);
              n = n + 1;
            } while (p[n + 1] === ">");
          }
          v = v - 1;
          if (k === true) {
            M = M - 1;
          } else if (p[n - 1] !== "/") {
            M = M + 1;
          }
          if (v === 0 && O === 0 && M < 1) {
            L = Q(2, false);
            if (L.charAt(0) !== "<")
              return re();
            if (L.charAt(0) === "<" && se.indexOf(L.charAt(1)) < 0 && /\s/.test(L.charAt(1)) === false) {
              u = n + 1;
              do {
                u = u + 1;
                if (p[u] === ">" || /\s/.test(p[u - 1]) && se.indexOf(p[u]) < 0)
                  break;
                if (se.indexOf(p[u]) > -1)
                  return re();
              } while (u < w);
            } else {
              return re();
            }
          }
          k = false;
        }
        n = n + 1;
      } while (n < w);
      return re();
    }
    t = "operator";
    o = ke();
    H("");
  }
  function Q(u, r) {
    let k = r === true ? n : n + 1;
    let v = "";
    if (typeof u !== "number" || u < 1)
      u = 1;
    if (p[n] === "/") {
      if (p[n + 1] === "/") {
        v = "\n";
      } else if (p[n + 1] === "*") {
        v = "/";
      }
    }
    if (k < w) {
      do {
        if (/\s/.test(p[k]) === false) {
          if (p[k] === "/") {
            if (v === "") {
              if (p[k + 1] === "/") {
                v = "\n";
              } else if (p[k + 1] === "*") {
                v = "/";
              }
            } else if (v === "/" && p[k - 1] === "*") {
              v = "";
            }
          }
          if (v === "" && p[k - 1] + p[k] !== "*/")
            return p.slice(k, k + u).join("");
        } else if (v === "\n" && p[k] === "\n") {
          v = "";
        }
        k = k + 1;
      } while (k < w);
    }
    return "";
  }
  function ne() {
    const u = w;
    const r = [p[n]];
    let k = 0;
    let v = /zz/;
    let O = r[0] === ".";
    if (n < w - 2 && p[n] === "0") {
      if (p[n + 1] === "x") {
        v = /[0-9a-fA-F]/;
      } else if (p[n + 1] === "o") {
        v = /[0-9]/;
      } else if (p[n + 1] === "b") {
        v = /0|1/;
      }
      if (v.test(p[n + 2]) === true) {
        r.push(p[n + 1]);
        k = n + 1;
        do {
          k = k + 1;
          r.push(p[k]);
        } while (v.test(p[k + 1]) === true);
        n = k;
        return r.join("");
      }
    }
    k = n + 1;
    if (k < u) {
      do {
        if (/[0-9]/.test(p[k]) || p[k] === "." && O === false) {
          r.push(p[k]);
          if (p[k] === ".")
            O = true;
        } else {
          break;
        }
        k = k + 1;
      } while (k < u);
    }
    if (k < u - 1 && (/\d/.test(p[k - 1]) === true || /\d/.test(p[k - 2]) === true && (p[k - 1] === "-" || p[k - 1] === "+")) && (p[k] === "e" || p[k] === "E")) {
      r.push(p[k]);
      if (p[k + 1] === "-" || p[k + 1] === "+") {
        r.push(p[k + 1]);
        k = k + 1;
      }
      O = false;
      k = k + 1;
      if (k < u) {
        do {
          if (/[0-9]/.test(p[k]) || p[k] === "." && O === false) {
            r.push(p[k]);
            if (p[k] === ".")
              O = true;
          } else {
            break;
          }
          k = k + 1;
        } while (k < u);
      }
    }
    n = k - 1;
    return r.join("");
  }
  function ke() {
    let u = 0;
    let r = 0;
    let k = w;
    let v = "";
    const O = ["=", "<", ">", "+", "*", "?", "|", "^", ":", "&", "%", "~"];
    const M = O.length;
    if (S > -1)
      j();
    if (p[n] === "/" && (s.count > -1 && (t !== "word" && t !== "reference" || o === "typeof" || o === "return" || o === "else") && t !== "number" && t !== "string" && t !== "end")) {
      if (o === "return" || o === "typeof" || o === "else" || t !== "word") {
        o = ge();
        t = "regex";
      } else {
        o = "/";
        t = "operator";
      }
      H("");
      return "regex";
    }
    if (p[n] === "?" && ("+-*/.?".indexOf(p[n + 1]) > -1 || p[n + 1] === ":" && O.join("").indexOf(p[n + 2]) < 0)) {
      if (p[n + 1] === "." && /\d/.test(p[n + 2]) === false) {
        v = "?.";
      } else if (p[n + 1] === "?") {
        v = "??";
      }
      if (v === "")
        return "?";
    }
    if (p[n] === ":" && "+-*/".indexOf(p[n + 1]) > -1)
      return ":";
    if (n < w - 1) {
      if (p[n] !== "<" && p[n + 1] === "<")
        return p[n];
      if (p[n] === "!" && p[n + 1] === "/")
        return "!";
      if (p[n] === "-") {
        g[g.length - 1] = false;
        if (p[n + 1] === "-") {
          v = "--";
        } else if (p[n + 1] === "=") {
          v = "-=";
        } else if (p[n + 1] === ">") {
          v = "->";
        }
        if (v === "")
          return "-";
      }
      if (p[n] === "+") {
        g[g.length - 1] = false;
        if (p[n + 1] === "+") {
          v = "++";
        } else if (p[n + 1] === "=") {
          v = "+=";
        }
        if (v === "")
          return "+";
      }
      if (p[n] === "=" && p[n + 1] !== "=" && p[n + 1] !== "!" && p[n + 1] !== ">") {
        g[g.length - 1] = false;
        return "=";
      }
    }
    if (p[n] === ":") {
      if (h.language === "typescript") {
        if (i.stack[s.count] === "arguments") {
          if (i.token[s.count] === "?") {
            s.pop(i);
            v = "?:";
            n = n - 1;
          }
          g[g.length - 1] = true;
        } else if (o === ")" && (i.token[i.begin[s.count] - 1] === "function" || i.token[i.begin[s.count] - 2] === "function")) {
          g[g.length - 1] = true;
        } else if (t === "reference") {
          u = s.count;
          let L = false;
          do {
            if (i.begin[u] === i.begin[s.count]) {
              if (u < s.count && i.token[u] === ":" && i.types[u + 1] !== "type")
                L = true;
              if (i.token[u] === "?" && L === false)
                break;
              if (i.token[u] === ";" || i.token[u] === "x;")
                break;
              if (i.token[u] === "var" || i.token[u] === "let" || i.token[u] === "const" || i.types[u] === "type") {
                g[g.length - 1] = true;
                break;
              }
            } else {
              if (i.types[u] === "type_end") {
                g[g.length - 1] = true;
                break;
              }
              u = i.begin[u];
            }
            u = u - 1;
          } while (u > i.begin[s.count]);
        }
      } else if (i.token[s.count - 1] === "[" && (i.types[s.count] === "word" || i.types[s.count] === "reference")) {
        s.structure[s.structure.length - 1][0] = "attribute";
        i.stack[s.count] = "attribute";
      }
    }
    if (v === "") {
      if (p[n + 1] === "+" && p[n + 2] === "+" || p[n + 1] === "-" && p[n + 2] === "-") {
        v = p[n];
      } else {
        const L = [p[n]];
        u = n + 1;
        if (u < k) {
          do {
            if (p[u] === "+" && p[u + 1] === "+" || p[u] === "-" && p[u + 1] === "-")
              break;
            r = 0;
            if (r < M) {
              do {
                if (p[u] === O[r]) {
                  L.push(O[r]);
                  break;
                }
                r = r + 1;
              } while (r < M);
            }
            if (r === M)
              break;
            u = u + 1;
          } while (u < k);
        }
        v = L.join("");
      }
    }
    n = n + (v.length - 1);
    if (v === "=>" && o === ")") {
      u = s.count;
      k = i.begin[u];
      do {
        if (i.begin[u] === k)
          i.stack[u] = "method";
        u = u - 1;
      } while (u > k - 1);
    }
    return v;
  }
  function B() {
    let u = true;
    let r = "+";
    let k = "";
    let v = "";
    let O = "";
    let M = 0;
    let L = 0;
    let W = 0;
    let ie = "";
    const D = [];
    function Y() {
      W = i.begin[W] - 1;
      if (i.types[W] === "end") {
        Y();
      } else if (i.token[W - 1] === ".") {
        se();
      }
    }
    function se() {
      W = W - 2;
      if (i.types[W] === "end") {
        Y();
      } else if (i.token[W - 1] === ".") {
        se();
      }
    }
    function re() {
      let K = 0;
      const ue = D.length;
      if (K < ue) {
        do {
          s.push(i, D[K], "");
          K = K + 1;
        } while (K < ue);
      }
    }
    function J(K) {
      const ue = xe(null);
      ue.begin = i.begin[K];
      ue.ender = i.ender[K];
      ue.lexer = i.lexer[K];
      ue.lines = i.lines[K];
      ue.stack = i.stack[K];
      ue.token = i.token[K];
      ue.types = i.types[K];
      return ue;
    }
    k = i.token[s.count];
    v = i.token[s.count - 1];
    O = i.token[s.count - 2];
    if (k !== "++" && k !== "--" && v !== "++" && v !== "--") {
      W = s.count;
      if (i.types[W] === "end") {
        Y();
      } else if (i.token[W - 1] === ".") {
        se();
      }
    }
    if (i.token[W - 1] === "++" || i.token[W - 1] === "--") {
      if ("startendoperator".indexOf(i.types[W - 2]) > -1)
        return;
      M = W;
      if (M < s.count + 1) {
        do {
          D.push(J(M));
          M = M + 1;
        } while (M < s.count + 1);
        s.splice({ data: i, howmany: s.count - W, index: W });
      }
    } else {
      if (h.script.correct === false || k !== "++" && k !== "--" && v !== "++" && v !== "--") {
        return;
      }
      ie = Q(1, false);
      if ((k === "++" || k === "--") && (p[n] === ";" || ie === ";" || p[n] === "}" || ie === "}" || p[n] === ")" || ie === ")")) {
        r = i.stack[s.count];
        if (r === "array" || r === "method" || r === "object" || r === "paren" || r === "notation" || i.token[i.begin[s.count] - 1] === "while" && r !== "while") {
          return;
        }
        M = s.count;
        do {
          M = M - 1;
          if (i.token[M] === "return")
            return;
          if (i.types[M] === "end") {
            do {
              M = i.begin[M] - 1;
            } while (i.types[M] === "end" && M > 0);
          }
        } while (M > 0 && (i.token[M] === "." || i.types[M] === "word" || i.types[M] === "reference" || i.types[M] === "end"));
        if (i.token[M] === "," && p[n] !== ";" && ie !== ";" && p[n] !== "}" && ie !== "}" && p[n] !== ")" && ie !== ")") {
          return;
        }
        if (i.types[M] === "operator") {
          if (i.stack[M] === "switch" && i.token[M] === ":") {
            do {
              M = M - 1;
              if (i.types[M] === "start") {
                L = L - 1;
                if (L < 0)
                  break;
              } else if (i.types[M] === "end") {
                L = L + 1;
              }
              if (i.token[M] === "?" && L === 0)
                return;
            } while (M > 0);
          } else {
            return;
          }
        }
        u = false;
        r = k === "--" ? "-" : "+";
      } else if (O === "[" || O === ";" || O === "x;" || O === "}" || O === "{" || O === "(" || O === ")" || O === "," || O === "return") {
        if (k === "++" || k === "--") {
          if (O === "[" || O === "(" || O === "," || O === "return")
            return;
          if (k === "--")
            r = "-";
          u = false;
        } else if (v === "--" || k === "--") {
          r = "-";
        }
      } else {
        return;
      }
      if (u === false)
        e = s.pop(i);
      W = s.count;
      if (i.types[W] === "end") {
        Y();
      } else if (i.token[W - 1] === ".") {
        se();
      }
      M = W;
      if (M < s.count + 1) {
        do {
          D.push(J(M));
          M = M + 1;
        } while (M < s.count + 1);
      }
    }
    if (u === true) {
      s.splice({ data: i, howmany: 1, index: W - 1 });
      o = "=";
      t = "operator";
      H("");
      re();
      o = r;
      t = "operator";
      H("");
      o = "1";
      t = "number";
      H("");
    } else {
      o = "=";
      t = "operator";
      H("");
      re();
      o = r;
      t = "operator";
      H("");
      o = "1";
      t = "number";
      H("");
    }
    o = i.token[s.count];
    t = i.types[s.count];
    if (ie === "}" && p[n] !== ";")
      A(false);
  }
  function H(u) {
    const r = xe(null);
    r.begin = s.structure[s.structure.length - 1][1];
    r.ender = -1;
    r.lexer = "script";
    r.lines = s.linesSpace;
    r.stack = s.structure[s.structure.length - 1][0];
    r.token = o;
    r.types = t;
    s.push(i, r, u);
  }
  function ge() {
    let u = n + 1;
    let r = 0;
    let k = 0;
    let v = "";
    let O = false;
    const M = w;
    const L = ["/"];
    if (u < M) {
      do {
        L.push(p[u]);
        if (p[u - 1] !== "\\" || p[u - 2] === "\\") {
          if (p[u] === "[") {
            O = true;
          }
          if (p[u] === "]") {
            O = false;
          }
        }
        if (p[u] === "/" && O === false) {
          if (p[u - 1] === "\\") {
            k = 0;
            r = u - 1;
            if (r > 0) {
              do {
                if (p[r] === "\\") {
                  k = k + 1;
                } else {
                  break;
                }
                r = r - 1;
              } while (r > 0);
            }
            if (k % 2 === 0) {
              break;
            }
          } else {
            break;
          }
        }
        u = u + 1;
      } while (u < M);
    }
    if (p[u + 1] === "g" || p[u + 1] === "i" || p[u + 1] === "m" || p[u + 1] === "y" || p[u + 1] === "u") {
      L.push(p[u + 1]);
      if (p[u + 2] !== p[u + 1] && (p[u + 2] === "g" || p[u + 2] === "i" || p[u + 2] === "m" || p[u + 2] === "y" || p[u + 2] === "u")) {
        L.push(p[u + 2]);
        if (p[u + 3] !== p[u + 1] && p[u + 3] !== p[u + 2] && (p[u + 3] === "g" || p[u + 3] === "i" || p[u + 3] === "m" || p[u + 3] === "y" || p[u + 3] === "u")) {
          L.push(p[u + 3]);
          if (p[u + 4] !== p[u + 1] && p[u + 4] !== p[u + 2] && p[u + 4] !== p[u + 3] && (p[u + 4] === "g" || p[u + 4] === "i" || p[u + 4] === "m" || p[u + 4] === "y" || p[u + 4] === "u")) {
            L.push(p[u + 4]);
            if (p[u + 5] !== p[u + 1] && p[u + 5] !== p[u + 2] && p[u + 5] !== p[u + 3] && p[u + 5] !== p[u + 4] && (p[u + 5] === "g" || p[u + 5] === "i" || p[u + 5] === "m" || p[u + 5] === "y" || p[u + 5] === "u")) {
              L.push(p[u + 4]);
              n = u + 5;
            } else {
              n = u + 4;
            }
          } else {
            n = u + 3;
          }
        } else {
          n = u + 2;
        }
      } else {
        n = u + 1;
      }
    } else {
      n = u;
    }
    v = L.join("");
    return v;
  }
  function ye(u) {
    const r = u;
    do {
      u = u - 1;
    } while (p[u] === "\\" && u > 0);
    return (r - u) % 2 === 1;
  }
  function pe(u) {
    let r = s.count;
    let k = "";
    let v = "";
    let O = "";
    let M = false;
    U.push(u);
    if (u === "{" && (i.types[s.count] === "type" || i.types[s.count] === "type_end" || i.types[s.count] === "generic")) {
      let L = 0;
      if (i.types[s.count] === "type_end")
        r = i.begin[s.count];
      L = r;
      do {
        r = r - 1;
        if (i.begin[r] !== L && i.begin[r] !== -1)
          break;
        if (i.token[r] === ":")
          break;
      } while (r > i.begin[r]);
      if (i.token[r] === ":" && i.stack[r - 1] === "arguments") {
        g.push(false);
        M = true;
      } else {
        g.push(g[g.length - 1]);
      }
      r = s.count;
    } else if (u === "[" && i.types[s.count] === "type_end") {
      g.push(true);
    } else {
      g.push(g[g.length - 1]);
    }
    if (S > -1) {
      j();
      r = s.count;
    }
    if (m.len > -1)
      m.count[m.len] = m.count[m.len] + 1;
    if (i.token[r - 1] === "function") {
      P.push(["function", r + 1]);
    } else {
      P.push([o, r + 1]);
    }
    o = u;
    if (g[g.length - 1] === true) {
      t = "type_start";
    } else {
      t = "start";
    }
    if (u === "(" || u === "x(") {
      $();
    } else if (u === "{") {
      if (b > -1) {
        if (i.begin[b - 1] === i.begin[i.begin[r] - 1] || i.token[i.begin[r]] === "x(") {
          b = -1;
          if (h.script.correct === true) {
            z(")");
          } else {
            z("x)");
          }
          $();
          o = "{";
          t = "start";
        }
      } else if (o === ")") {
        $();
      }
      if (t === "comment" && i.token[r - 1] === ")") {
        o = i.token[r];
        i.token[r] = "{";
        t = i.types[r];
        i.types[r] = "start";
      }
    }
    k = (() => {
      let L = s.count;
      if (i.types[L] === "comment") {
        do {
          L = L - 1;
        } while (L > 0 && i.types[L] === "comment");
      }
      return i.token[L];
    })();
    v = i.stack[r] === void 0 ? "" : (() => {
      let L = s.count;
      if (i.types[L] === "comment") {
        do {
          L = L - 1;
        } while (L > 0 && i.types[L] === "comment");
      }
      return i.token[i.begin[L] - 1];
    })();
    if (d(o, 123) && (i.types[r] === "word" || i.token[r] === "]")) {
      let L = r;
      if (i.token[L] === "]") {
        do {
          L = i.begin[L] - 1;
        } while (i.token[L] === "]");
      }
      do {
        if (i.types[L] === "start" || i.types[L] === "end" || i.types[L] === "operator")
          break;
        L = L - 1;
      } while (L > 0);
      if (i.token[L] === ":" && i.stack[L - 1] === "arguments") {
        O = "function";
        N.push(a);
        a = [];
      }
    }
    if (t === "type_start") {
      O = "data_type";
    } else if (O === "" && (d(o, 123) || o === "x{")) {
      if (k === "else" || k === "do" || k === "try" || k === "finally" || k === "switch") {
        O = k;
      } else if (V[V.length - 1] === 0 && k !== "return") {
        V.pop();
        O = "class";
      } else if (i.token[r - 1] === "class") {
        O = "class";
      } else if (i.token[r] === "]" && i.token[r - 1] === "[") {
        O = "array";
      } else if ((i.types[r] === "word" || i.types[r] === "reference") && (i.types[r - 1] === "word" || i.types[r - 1] === "reference" || i.token[r - 1] === "?" && (i.types[r - 2] === "word" || i.types[r - 2] === "reference")) && i.token[r] !== "in" && i.token[r - 1] !== "export" && i.token[r - 1] !== "import") {
        O = "map";
      } else if (i.stack[r] === "method" && i.types[r] === "end" && (i.types[i.begin[r] - 1] === "word" || i.types[i.begin[r] - 1] === "reference") && i.token[i.begin[r] - 2] === "new") {
        O = "initializer";
      } else if (d(o, 123) && (d(k, 41) || k === "x)") && (i.types[i.begin[r] - 1] === "word" || i.types[i.begin[r] - 1] === "reference" || i.token[i.begin[r] - 1] === "]")) {
        if (v === "if") {
          O = "if";
        } else if (v === "for") {
          O = "for";
        } else if (v === "while") {
          O = "while";
        } else if (v === "class") {
          O = "class";
        } else if (v === "switch" || i.token[i.begin[r] - 1] === "switch") {
          O = "switch";
        } else if (v === "catch") {
          O = "catch";
        } else {
          O = "function";
        }
      } else if (d(o, 123) && (k === ";" || k === "x;")) {
        O = "block";
      } else if (d(o, 123) && i.token[r] === ":" && i.stack[r] === "switch") {
        O = "block";
      } else if (i.token[r - 1] === "import" || i.token[r - 2] === "import" || i.token[r - 1] === "export" || i.token[r - 2] === "export") {
        O = "object";
      } else if (d(k, 41) && (_[0] === "function" || _[0] === "if" || _[0] === "for" || _[0] === "class" || _[0] === "while" || _[0] === "switch" || _[0] === "catch")) {
        O = _[0];
      } else if (i.stack[r] === "notation") {
        O = "function";
      } else if ((i.types[r] === "number" || i.types[r] === "string" || i.types[r] === "word" || i.types[r] === "reference") && (i.types[r - 1] === "word" || i.types[r - 1] === "reference") && i.token[i.begin[r] - 1] !== "for") {
        O = "function";
      } else if (s.structure.length > 0 && i.token[r] !== ":" && s.structure[s.structure.length - 1][0] === "object" && (i.token[i.begin[r] - 2] === "{" || i.token[i.begin[r] - 2] === ",")) {
        O = "function";
      } else if (i.types[_[1] - 1] === "markup" && i.token[_[1] - 3] === "function") {
        O = "function";
      } else if (k === "=>") {
        O = "function";
      } else if (M === true || i.types[s.count] === "type_end" && i.stack[i.begin[s.count] - 2] === "arguments") {
        O = "function";
      } else if (d(k, 41) && i.stack[r] === "method" && (i.types[i.begin[r] - 1] === "word" || i.types[i.begin[r] - 1] === "property" || i.types[i.begin[r] - 1] === "reference")) {
        O = "function";
      } else if (i.types[r] === "word" && d(o, 123) && i.token[r] !== "return" && i.token[r] !== "in" && i.token[r] !== "import" && i.token[r] !== "const" && i.token[r] !== "let" && i.token[r] !== "") {
        O = "block";
      } else if (d(o, 123) && "if|else|for|while|function|class|switch|catch|finally".indexOf(i.stack[r]) > -1 && (i.token[r] === "x}" || i.token[r] === "}")) {
        O = "block";
      } else if (i.stack[r] === "arguments") {
        O = "function";
      } else if (i.types[r] === "generic") {
        do {
          r = r - 1;
          if (i.token[r] === "function" || i.stack[r] === "arguments") {
            O = "function";
            break;
          }
          if (i.token[r] === "interface") {
            O = "map";
            break;
          }
          if (i.token[r] === ";") {
            O = "object";
            break;
          }
        } while (r > i.begin[s.count]);
      } else {
        O = "object";
      }
      if (O !== "object" && O !== "class") {
        if (O === "function") {
          N.push(a);
          a = [];
        } else {
          N.push([]);
        }
      }
    } else if (o === "[") {
      O = "array";
    } else if (o === "(" || o === "x(") {
      if (k === "function" || i.token[r - 1] === "function" || i.token[r - 1] === "function*" || i.token[r - 2] === "function") {
        O = "arguments";
      } else if (i.token[r - 1] === "." || i.token[i.begin[r] - 2] === ".") {
        O = "method";
      } else if (i.types[r] === "generic") {
        O = "method";
      } else if (i.token[r] === "}" && i.stack[r] === "function") {
        O = "method";
      } else if (k === "if" || k === "for" || k === "class" || k === "while" || k === "catch" || k === "finally" || k === "switch" || k === "with") {
        O = "expression";
      } else if (i.types[r] === "word" || i.types[r] === "property" || i.types[r] === "reference") {
        O = "method";
      } else {
        O = "paren";
      }
    }
    H(O);
    if (V.length > 0)
      V[V.length - 1] = V[V.length - 1] + 1;
  }
  function Se() {
    const u = [p[n]];
    n = n + 1;
    if (n < w) {
      do {
        u.push(p[n]);
        if (p[n] === "`" && (p[n - 1] !== "\\" || ye(n - 1) === false))
          break;
        if (p[n - 1] === "$" && p[n] === "{" && (p[n - 2] !== "\\" || ye(n - 2) === false))
          break;
        n = n + 1;
      } while (n < w);
    }
    return u.join("");
  }
  function $e(u) {
    let r = 2;
    let k = 0;
    let v = "";
    const O = u.slice(0, 2);
    const M = u.length;
    if (u.charAt(2) === "-")
      r = r + 1;
    if (/\s/.test(u.charAt(r)) === true) {
      do {
        r = r + 1;
      } while (/\s/.test(u.charAt(r)) === true && r < M);
    }
    k = r;
    do {
      k = k + 1;
    } while (/\s/.test(u.charAt(k)) === false && u.charAt(k) !== "(" && k < M);
    if (k === M)
      k = u.length - 2;
    v = u.slice(r, k);
    if (v === "else" || O === "{%" && (v === "elseif" || v === "when" || v === "elif" || v === "elsif")) {
      return ["template_else", `template_${v}`];
    }
    if (O === "{{") {
      if (v === "end")
        return ["template_end", ""];
      if (v === "block" && /\{%\s*\w/.test(c) === false || v === "define" || v === "form" || v === "if" || v === "unless" || v === "range" || v === "with") {
        return ["template_start", `template_${v}`];
      }
      return ["template", ""];
    }
    k = x.length - 1;
    if (k > -1) {
      do {
        if (v === x[k] && (v !== "block" || /\{%\s*\w/.test(c) === false)) {
          return ["template_start", `template_${v}`];
        }
        if (v === "end" + x[k]) {
          return ["template_end", ""];
        }
        k = k - 1;
      } while (k > -1);
    }
    return ["template", ""];
  }
  function Re() {
    m.count.pop();
    m.index.pop();
    m.word.pop();
    m.len = m.len - 1;
  }
  function j() {
    let u = S;
    let r = 1;
    let k = "";
    let v = "";
    let O = o;
    let M = t;
    const L = [];
    function W() {
      U.push("x{");
      s.splice({ data: i, howmany: 1, index: s.count - 3 });
    }
    function ie(D, Y, se) {
      const re = i.begin[D];
      let J = 0;
      do {
        if (i.token[D] === Y && i.types[D] === "word") {
          if (se === true) {
            i.types[D] = "reference";
          } else if (i.begin[D] > re && i.token[i.begin[D]] === "{" && i.stack[D] !== "object" && i.stack[D] !== "class" && i.stack[D] !== "data_type") {
            if (i.stack[D] === "function") {
              i.types[D] = "reference";
            } else {
              J = i.begin[D];
              do {
                if (i.stack[J] === "function") {
                  i.types[D] = "reference";
                  break;
                }
                J = i.begin[J];
              } while (J > re);
            }
          }
        }
        D = D - 1;
      } while (D > re);
    }
    do {
      L.push(p[u]);
      if (p[u] === "\\") {
        s.error = `Illegal escape in JavaScript on line number ${s.lineNumber}`;
      }
      u = u + 1;
    } while (u < n);
    if (o.charAt(0) === "\u201C") {
      s.error = `Quote looking character (\u201C, \\u201c) used instead of actual quotes on line number ${s.lineNumber}`;
    } else if (o.charAt(0) === "\u201D") {
      s.error = `Quote looking character (\u201D, \\u201d) used instead of actual quotes on line number ${s.lineNumber}`;
    }
    k = L.join("");
    S = -1;
    if (s.count > 0 && k === "function" && i.token[s.count] === "(" && (i.token[s.count - 1] === "{" || i.token[s.count - 1] === "x{")) {
      i.types[s.count] = "start";
    }
    if (s.count > 1 && k === "function" && o === "(" && (i.token[s.count - 1] === "}" || i.token[s.count - 1] === "x}")) {
      if (i.token[s.count - 1] === "}") {
        u = s.count - 2;
        if (u > -1) {
          do {
            if (i.types[u] === "end") {
              r = r + 1;
            } else if (i.types[u] === "start" || i.types[u] === "end") {
              r = r - 1;
            }
            if (r === 0)
              break;
            u = u - 1;
          } while (u > -1);
        }
        if (i.token[u] === "{" && i.token[u - 1] === ")") {
          r = 1;
          u = u - 2;
          if (u > -1) {
            do {
              if (i.types[u] === "end") {
                r = r + 1;
              } else if (i.types[u] === "start" || i.types[u] === "end") {
                r = r - 1;
              }
              if (r === 0)
                break;
              u = u - 1;
            } while (u > -1);
          }
          if (i.token[u - 1] !== "function" && i.token[u - 2] !== "function") {
            i.types[s.count] = "start";
          }
        }
      } else {
        i.types[s.count] = "start";
      }
    }
    if (h.script.correct === true && (k === "Object" || k === "Array") && p[n + 1] === "(" && p[n + 2] === ")" && i.token[s.count - 1] === "=" && i.token[s.count] === "new") {
      if (k === "Object") {
        i.token[s.count] = "{";
        o = "}";
        i.stack[s.count] = "object";
        s.structure[s.structure.length - 1][0] = "object";
      } else {
        i.token[s.count] = "[";
        o = "]";
        i.stack[s.count] = "array";
        s.structure[s.structure.length - 1][0] = "array";
      }
      i.types[s.count] = "start";
      t = "end";
      p[n + 1] = "";
      p[n + 2] = "";
      n = n + 2;
    } else {
      r = s.count;
      u = r;
      if (h.script.variableList !== "none" && (k === "var" || k === "let" || k === "const")) {
        if (i.types[r] === "comment") {
          do {
            r = r - 1;
          } while (r > 0 && i.types[r] === "comment");
        }
        if (h.script.variableList === "list" && m.len > -1 && m.index[m.len] === r && k === m.word[m.len]) {
          o = ",";
          t = "separator";
          i.token[r] = o;
          i.types[r] = t;
          m.count[m.len] = 0;
          m.index[m.len] = r;
          m.word[m.len] = k;
          return;
        }
        m.len = m.len + 1;
        m.count.push(0);
        m.index.push(r);
        m.word.push(k);
        r = u;
      } else if (m.len > -1 && k !== m.word[m.len] && s.count === m.index[m.len] && i.token[m.index[m.len]] === ";" && o !== m.word[m.len] && h.script.variableList === "list") {
        Re();
      }
      if (k === "from" && i.token[s.count] === "x;" && i.token[s.count - 1] === "}") {
        $();
      }
      if (k === "while" && i.token[s.count] === "x;" && i.token[s.count - 1] === "}") {
        let D = 0;
        let Y = s.count - 2;
        if (Y > -1) {
          do {
            if (i.types[Y] === "end") {
              D = D + 1;
            } else if (i.types[Y] === "start") {
              D = D - 1;
            }
            if (D < 0) {
              if (i.token[Y] === "{" && i.token[Y - 1] === "do")
                $();
              return;
            }
            Y = Y - 1;
          } while (Y > -1);
        }
      }
      if (M === "comment") {
        let D = s.count;
        do {
          D = D - 1;
        } while (D > 0 && i.types[D] === "comment");
        M = i.types[D];
        O = i.token[D];
      }
      v = Q(2, false);
      if (k === "void") {
        if (O === ":" && i.stack[s.count - 1] === "arguments") {
          t = "type";
        } else {
          t = "word";
        }
      } else if ((s.structure[s.structure.length - 1][0] === "object" || s.structure[s.structure.length - 1][0] === "class" || s.structure[s.structure.length - 1][0] === "data_type") && (i.token[s.count] === "{" || i.token[i.begin[s.count]] === "{" && i.token[s.count] === "," || i.types[s.count] === "template_end" && (i.token[i.begin[s.count] - 1] === "{" || i.token[i.begin[s.count] - 1] === ","))) {
        if (k === "return" || k === "break") {
          t = "word";
        } else {
          t = "property";
        }
      } else if (g[g.length - 1] === true || (h.language === "typescript" || h.language === "flow") && O === "type") {
        t = "type";
      } else if (N.length > 0 && (O === "function" || O === "class" || O === "const" || O === "let" || O === "var" || O === "new" || O === "void")) {
        t = "reference";
        N[N.length - 1].push(k);
        if (h.language === "javascript" || h.language === "jsx" || h.language === "typescript" || h.language === "tsx") {
          if (O === "var" || O === "function" && i.types[s.count - 1] !== "operator" && i.types[s.count - 1] !== "start" && i.types[s.count - 1] !== "end") {
            ie(s.count, k, true);
          } else {
            ie(s.count, k, false);
          }
        } else {
          ie(s.count, k, false);
        }
      } else if (s.structure[s.structure.length - 1][0] === "arguments" && t !== "operator") {
        t = "reference";
        a.push(k);
      } else if (O === "," && i.stack[s.count] !== "method" && (i.stack[s.count] !== "expression" || i.token[i.begin[s.count] - 1] === "for")) {
        let D = s.count;
        const Y = s.structure[s.structure.length - 1][1];
        do {
          if (i.begin[D] === Y) {
            if (i.token[D] === ";")
              break;
            if (i.token[D] === "var" || i.token[D] === "let" || i.token[D] === "const" || i.token[D] === "type") {
              break;
            }
          } else if (i.types[D] === "end") {
            D = i.begin[D];
          }
          D = D - 1;
        } while (D > Y);
        if (N.length > 0 && i.token[D] === "var") {
          t = "reference";
          N[N.length - 1].push(k);
          if (h.language === "javascript" || h.language === "jsx" || h.language === "typescript" || h.language === "tsx") {
            ie(D, k, true);
          } else {
            ie(D, k, false);
          }
        } else if (N.length > 0 && (i.token[D] === "let" || i.token[D] === "const" || i.token[D] === "type" && (h.language === "typescript" || h.language === "tsx"))) {
          t = "reference";
          N[N.length - 1].push(k);
          ie(D, k, false);
        } else {
          t = "word";
        }
      } else if (s.structure[s.structure.length - 1][0] !== "object" || s.structure[s.structure.length - 1][0] === "object" && o !== "," && o !== "{") {
        let D = N.length;
        let Y = 0;
        if (D > 0) {
          do {
            D = D - 1;
            Y = N[D].length;
            if (Y > 0) {
              do {
                Y = Y - 1;
                if (k === N[D][Y])
                  break;
              } while (Y > 0);
              if (k === N[D][Y])
                break;
            }
          } while (D > 0);
          if (N[D][Y] === k && O !== ".") {
            t = "reference";
          } else {
            t = "word";
          }
        } else {
          t = "word";
        }
      } else {
        t = "word";
      }
      o = k;
      if (k === "from" && i.token[s.count] === "}")
        $();
    }
    H("");
    if (k === "class")
      V.push(0);
    if (k === "do") {
      v = Q(1, true);
      if (v !== "{") {
        o = h.script.correct === true ? "{" : "x{";
        t = "start";
        U.push("x{");
        H("do");
      }
    }
    if (k === "else") {
      v = Q(2, true);
      let D = s.count - 1;
      if (i.types[D] === "comment") {
        do {
          D = D - 1;
        } while (D > 0 && i.types[D] === "comment");
      }
      if (i.token[D] === "x}") {
        if (i.token[s.count] === "else") {
          if (i.stack[s.count - 1] !== "if" && i.types[s.count - 1] !== "comment" && i.stack[s.count - 1] !== "else") {
            U.pop();
            s.splice({ data: i, howmany: 0, index: s.count - 1, record: { begin: i.begin[i.begin[i.begin[s.count - 1] - 1] - 1], ender: -1, lexer: "script", lines: 0, stack: "if", token: h.script.correct === true ? "}" : "x}", types: "end" } });
            if (s.structure.length > 1) {
              s.structure.splice(s.structure.length - 2, 1);
              s.structure[s.structure.length - 1][1] = s.count;
            }
          } else if (i.token[s.count - 2] === "x}" && y[0] !== "if" && i.stack[s.count] === "else") {
            W();
          } else if (i.token[s.count - 2] === "}" && i.stack[s.count - 2] === "if" && y[0] === "if" && i.token[y[1] - 1] !== "if" && i.token[i.begin[s.count - 1]] === "x{") {
            W();
          }
        } else if (i.token[s.count] === "x}" && i.stack[s.count] === "if") {
          W();
        }
      }
      if (v !== "if" && v.charAt(0) !== "{") {
        o = h.script.correct === true ? "{" : "x{";
        t = "start";
        U.push("x{");
        H("else");
      }
    }
    if ((k === "for" || k === "if" || k === "switch" || k === "catch") && i.token[s.count - 1] !== ".") {
      v = Q(1, true);
      if (v !== "(") {
        b = s.count;
        if (h.script.correct === true) {
          pe("(");
        } else {
          pe("x(");
        }
      }
    }
  }
  do {
    if (/\s/.test(p[n])) {
      if (S > -1)
        j();
      n = s.spacer({ array: p, end: w, index: n });
      if (s.linesSpace > 1 && o !== ";" && I < s.count && p[n + 1] !== "}") {
        A(false);
        I = s.count;
      }
    } else if (p[n] === "{" && p[n + 1] === "%") {
      G("{%", "%}", "template");
    } else if (p[n] === "{" && p[n + 1] === "{") {
      G("{{", "}}", "template");
    } else if (p[n] === "<" && p[n + 1] === "!" && p[n + 2] === "-" && p[n + 3] === "-") {
      G("<!--", "-->", "comment");
    } else if (p[n] === "<") {
      te();
    } else if (p[n] === "/" && (n === w - 1 || p[n + 1] === "*")) {
      q();
    } else if ((s.count < 0 || i.lines[s.count] > 0) && p[n] === "#" && p[n + 1] === "!" && (p[n + 2] === "/" || p[n + 2] === "[")) {
      G("#!" + p[n + 2], "\n", "string");
    } else if (p[n] === "/" && (n === w - 1 || p[n + 1] === "/")) {
      Z();
    } else if (d(p[n], 96) || d(p[n], 125) && s.structure[s.structure.length - 1][0] === "template_string") {
      if (S > -1)
        j();
      o = Se();
      if (d(o, 125) && o.slice(o.length - 2) === "${") {
        t = "template_string_else";
        H("template_string");
      } else if (o.slice(o.length - 2) === "${") {
        t = "template_string_start";
        H("template_string");
      } else if (d(o[0], 125)) {
        t = "template_string_end";
        H("");
      } else {
        t = "string";
        H("");
      }
    } else if (p[n] === '"' || p[n] === "'") {
      G(p[n], p[n], "string");
    } else if (p[n] === "-" && (n < w - 1 && p[n + 1] !== "=" && p[n + 1] !== "-") && (t === "number" || t === "word" || t === "reference") && o !== "return" && (o === ")" || o === "]" || t === "word" || t === "reference" || t === "number")) {
      if (S > -1)
        j();
      o = "-";
      t = "operator";
      H("");
    } else if (S === -1 && (p[n] !== "0" || p[n] === "0" && p[n + 1] !== "b") && (/\d/.test(p[n]) || n !== w - 2 && p[n] === "-" && p[n + 1] === "." && /\d/.test(p[n + 2]) || n !== w - 1 && (p[n] === "-" || p[n] === ".") && /\d/.test(p[n + 1]))) {
      if (S > -1)
        j();
      if (t === "end" && p[n] === "-") {
        o = "-";
        t = "operator";
      } else {
        o = ne();
        t = "number";
      }
      H("");
    } else if (p[n] === ":" && p[n + 1] === ":") {
      if (S > -1)
        j();
      if (h.script.correct === true)
        B();
      $();
      n = n + 1;
      o = "::";
      t = "separator";
      H("");
    } else if (p[n] === ",") {
      if (S > -1)
        j();
      if (h.script.correct === true)
        B();
      if (g[g.length - 1] === true && i.stack[s.count].indexOf("type") < 0) {
        g[g.length - 1] = false;
      }
      if (t === "comment") {
        ee();
      } else if (m.len > -1 && m.count[m.len] === 0 && h.script.variableList === "each") {
        $();
        o = ";";
        t = "separator";
        H("");
        o = m.word[m.len];
        t = "word";
        H("");
        m.index[m.len] = s.count;
      } else {
        o = ",";
        t = "separator";
        $();
        H("");
      }
    } else if (p[n] === ".") {
      if (S > -1)
        j();
      g[g.length - 1] = false;
      if (p[n + 1] === "." && p[n + 2] === ".") {
        o = "...";
        t = "operator";
        n = n + 2;
      } else {
        $();
        o = ".";
        t = "separator";
      }
      if (/\s/.test(p[n - 1]) === true)
        s.linesSpace = 1;
      H("");
    } else if (p[n] === ";") {
      if (S > -1)
        j();
      if (g[g.length - 1] === true && i.stack[s.count].indexOf("type") < 0) {
        g[g.length - 1] = false;
      }
      if (V[V.length - 1] === 0)
        V.pop();
      if (m.len > -1 && m.count[m.len] === 0) {
        if (h.script.variableList === "each") {
          Re();
        } else {
          m.index[m.len] = s.count + 1;
        }
      }
      if (h.script.correct === true)
        B();
      o = ";";
      t = "separator";
      if (i.token[s.count] === "x}") {
        E();
      } else {
        H("");
      }
      R();
    } else if (p[n] === "(" || p[n] === "[" || p[n] === "{") {
      pe(p[n]);
    } else if (p[n] === ")" || p[n] === "]" || p[n] === "}") {
      z(p[n]);
    } else if (p[n] === "*" && i.stack[s.count] === "object" && S < 0 && /\s/.test(p[n + 1]) === false && p[n + 1] !== "=" && /\d/.test(p[n + 1]) === false) {
      S = n;
    } else if (p[n] === "=" || p[n] === "&" || p[n] === "<" || p[n] === ">" || p[n] === "+" || p[n] === "-" || p[n] === "*" || p[n] === "/" || p[n] === "!" || p[n] === "?" || p[n] === "|" || p[n] === "^" || p[n] === ":" || p[n] === "%" || p[n] === "~") {
      o = ke();
      if (o === "regex") {
        o = i.token[s.count];
      } else if (o === "*" && i.token[s.count] === "function") {
        i.token[s.count] = "function*";
      } else {
        t = "operator";
        if (o !== "!" && o !== "++" && o !== "--")
          $();
        H("");
      }
    } else if (S < 0 && p[n] !== "") {
      S = n;
    }
    if (m.len > -1 && s.count === m.index[m.len] + 1 && i.token[m.index[m.len]] === ";" && o !== m.word[m.len] && t !== "comment" && h.script.variableList === "list") {
      Re();
    }
    n = n + 1;
  } while (n < w);
  if (S > -1)
    j();
  if ((i.token[s.count] !== "}" && i.token[0] === "{" || i.token[0] !== "{") && (i.token[s.count] !== "]" && i.token[0] === "[" || i.token[0] !== "[")) {
    A(false);
  }
  if (f[0] === s.count) {
    o = "\n" + f[1];
    t = "string";
    H("");
  }
  if (i.token[s.count] === "x;" && (i.token[s.count - 1] === "}" || i.token[s.count - 1] === "]") && i.begin[s.count - 1] === 0) {
    s.pop(i);
  }
  return i;
};
var We = { markup: "markup", html: "markup", liquid: "markup", xml: "markup", javascript: "script", typescript: "script", jsx: "script", tsx: "script", json: "script", less: "style", scss: "style", sass: "style", css: "style", text: "text" };
var Ge = { html: "HTML", xhtml: "XHTML", liquid: "Liquid", xml: "XML", jsx: "JSX", tsx: "TSX", json: "JSON", yaml: "YAML", css: "CSS", scss: "SCSS", sass: "SASS", less: "LESS", text: "Plain Text", javascript: "JavaScript", typescript: "TypeScript" };
function Fe(l4) {
  return typeof l4 !== "string" || l4.indexOf("html") > -1 || We[l4] === void 0 ? "markup" : We[l4];
}
function st(l4) {
  if (typeof l4 !== "string" || Ge[l4] === void 0)
    return l4.toUpperCase();
  return Ge[l4];
}
function he(l4) {
  const c = {};
  if (l4 === "unknown") {
    c.language = l4;
    c.languageName = "Unknown";
    c.lexer = "markup";
  } else if (l4 === "xhtml" || l4 === "markup") {
    c.language = "xml";
    c.languageName = "XHTML";
    c.lexer = "markup";
  } else {
    c.language = l4;
    c.languageName = st(l4);
    c.lexer = Fe(l4);
  }
  if (T.hooks.language.length > 0) {
    for (const h of T.hooks.language) {
      const n = h(c);
      if (typeof n === "object")
        Ce(c, n);
    }
  }
  return c;
}
_e.reference = he;
_e.listen = function(l4) {
  T.hooks.language.push(l4);
};
function _e(l4) {
  let c = [];
  let h = 0;
  const n = /(((var)|(let)|(const)|(function)|(import))\s+(\w|\$)+[a-zA-Z0-9]*)/.test(l4) && /@import/.test(l4) === false;
  const o = /((((final)|(public)|(private))\s+static)|(static\s+void))/.test(l4);
  function t() {
    if (/\n\s*#+\s+/.test(l4) || /^#+\s+/.test(l4))
      return he("markdown");
    if (/\$[a-zA-Z]/.test(l4) || /\{\s*(\w|\.|\$|#)+\s*\{/.test(l4) || /^[.#]?[\w][\w-]+\s+\{(?:\s+[a-z][a-z-]+:\s*\S+;)+\s+[&>+]?\s+[.#:]?[\w][\w-]\s+\{/.test(l4) && /:\s*@[a-zA-Z];/.test(l4) === false)
      return he("scss");
    if (/@[a-zA-Z]:/.test(l4) || /\.[a-zA-Z]\(\);/.test(l4))
      return he("less");
    return he("css");
  }
  function _() {
    let S = 1;
    let b = C;
    let a = false;
    let e = false;
    const y = /((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/.test(l4);
    function F() {
      if (l4.indexOf("(") > -1 || l4.indexOf("=") > -1 || l4.indexOf(";") > -1 && l4.indexOf("{") > -1) {
        if (o === true || /\w<\w+(,\s+\w+)*>/.test(l4))
          return he("typescript");
        if (/(?:var|let|const)\s+\w+\s*:/.test(l4) || /=\s*<\w+/.test(l4))
          return he("typescript");
        return he("javascript");
      }
      return he("unknown");
    }
    function i() {
      if (/:\s*(?:number|string|boolean|any|unknown)(?:\[\])?/.test(l4) || /(?:public|private)\s+/.test(l4) || /(?:export|declare)\s+type\s+\w+\s*=/.test(l4) || /(?:namespace|interface|enum|implements|declare)\s+\w+/.test(l4) || /(?:typeof|keyof|as)\s+\w+/.test(l4) || /\w+\s+as\s+\w+/.test(l4) || /\[\w+(?:(?::\s*\w+)|(?:\s+in\s+\w+))\]:/.test(l4) || /\):\s*\w+(?:\[\])?\s*(?:=>|\{)\s+/.test(l4) || /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/.test(l4))
        return he("typescript");
      if (/\s(class|var|const|let)\s+\w/.test(l4) === false && /<[a-zA-Z](?:-[a-zA-Z])?/.test(l4) && /<\/[a-zA-Z-](?:-[a-zA-Z])?/.test(l4) && (/\s?\{%/.test(l4) || /{{/.test(l4)))
        return he("liquid");
      if (/^(\s*[$@])/.test(l4) === false && /([}\]];?\s*)$/.test(l4)) {
        if (/^\s*import\s+\*\s+as\s+\w+\s+from\s+['"]/.test(l4) || /module\.export\s+=\s+/.test(l4) || /export\s+default\s+\{/.test(l4) || /[?:]\s*[{[]/.test(l4) || /^(?:\s*return;?(?:\s+[{[])?)/.test(l4)) {
          return he("javascript");
        }
      }
      if (/{%/.test(l4) && /{{/.test(l4) && /<\w/.test(l4))
        return he("liquid");
      if (/{\s*(?:\w|\.|@|#)+\s*\{/.test(l4))
        return he("less");
      if (/\$(\w|-)/.test(l4))
        return he("scss");
      if (/[;{:]\s*@\w/.test(l4) === true)
        return he("less");
      return he("css");
    }
    if (S < h) {
      do {
        if (a === false) {
          if (d(c[S], 42) && d(c[S - 1], 47)) {
            c[S - 1] = C;
            a = true;
          } else if (e === false && S < h - 6 && c[S].charCodeAt(0) === 102 && c[S + 1].charCodeAt(0) === 105 && c[S + 2].charCodeAt(0) === 108 && c[S + 3].charCodeAt(0) === 116 && c[S + 4].charCodeAt(0) === 101 && c[S + 5].charCodeAt(0) === 114 && d(c[S + 6], 58)) {
            e = true;
          }
        } else if (a === true && d(c[S], 42) && S !== h - 1 && d(c[S + 1], 47)) {
          a = false;
          c[S] = C;
          c[S + 1] = C;
        } else if (e === true && d(c[S], 59)) {
          e = false;
          c[S] = C;
        }
        if (a === true || e === true)
          c[S] = C;
        S = S + 1;
      } while (S < h);
    }
    b = c.join(C);
    if (/\s\/\//.test(l4) === false && /\/\/\s/.test(l4) === false && /^(\s*(\{|\[)(?!%))/.test(l4) === true && /((\]|\})\s*)$/.test(l4) && l4.indexOf(",") !== -1)
      return he("json");
    if (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i.test(l4) === true && (n === true || y === true || /console\.log\(/.test(l4) === true || /export\s+default\s+class\s+/.test(l4) === true || /export\s+(const|var|let|class)s+/.test(l4) === true || /document\.get/.test(l4) === true || /((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/.test(l4) === true || l4.indexOf("{") === -1 || /^(\s*if\s+\()/.test(l4) === true))
      return F();
    if (l4.indexOf("{") > -1 && (/^(\s*[\u007b\u0024\u002e#@a-z0-9])/i.test(l4) || /^(\s*\/(\*|\/))/.test(l4) || /^(\s*\*\s*\{)/.test(l4)) && /^(\s*if\s*\()/.test(l4) === false && /=\s*(\{|\[|\()/.test(b) === false && (/(\+|-|=|\?)=/.test(b) === false || /\/\/\s*=+/.test(b) || /=+('|")?\)/.test(l4) && /;\s*base64/.test(l4)) && /function(\s+\w+)*\s*\(/.test(b) === false)
      return i();
    return l4.indexOf("{%") > -1 ? he("liquid") : he("unknown");
  }
  function I() {
    function S() {
      return /{%-?\s*(schema|for|if|unless|render|include)/.test(l4) || /{%-?\s*end\w+/.test(l4) || /{{-?\s*content_for/.test(l4) || /{{-?\s*[a-zA-Z0-9_'".[\]]+\s*-?}}/.test(l4) || /{%/.test(l4) && /%}/.test(l4) && /{{/.test(l4) && /}}/.test(l4) ? he("liquid") : he("html");
    }
    return /^(\s*<!doctype\s+html>)/i.test(l4) || /^(\s*<html)/i.test(l4) || /<form\s/i.test(l4) && /<label\s/i.test(l4) && /<input\s/i.test(l4) || (/<img(\s+\w+=['"]?\S+['"]?)*\s+src\s*=/.test(l4) || /<a(\s+\w+=['"]?\S+['"]?)*\s+href\s*=/.test(l4)) || /<ul\s/i.test(l4) && /<li\s/i.test(l4) && /<\/li>/i.test(l4) && /<\/ul>/i.test(l4) || /<head\s*>/.test(l4) && /<\/head>/.test(l4) || /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(l4) && /XHTML\s+1\.1/.test(l4) === false && /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(l4) === false ? S() : /\s?{[{%]-?/.test(l4) ? he("liquid") : he("xml");
  }
  if (l4 === null || l4.replace(/\s+/g, C) === C)
    return he("unknown");
  if ((/\n\s*#{1,6}\s+/.test(l4) || /\n\s*(?:\*|-|(?:\d+\.))\s/.test(l4)) && (/\[( |x|X)\]/.test(l4) || /\s[*_~]{1,2}\w+[*_~]{1,2}/.test(l4) || /\n\s*```[a-zA-Z]*?\s+/.test(l4) || /-+\|(-+\|)+/.test(l4)))
    return he("markdown");
  if (/^(\s*<!DOCTYPE\s+html>)/i.test(l4))
    return I();
  if (/^\s*@(?:charset|import|include|keyframes|media|namespace|page)\b/.test(l4))
    return t();
  if (o === false && /=(>|=|-|\+|\*)/.test(l4) === false && /^(?:\s*((if)|(for)|(function))\s*\()/.test(l4) === false && /(?:\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(l4) === false && n === false && /return\s*\w*\s*(;|\})/.test(l4) === false && (l4 === void 0 || /^(?:\s*#(?!(!\/)))/.test(l4) || /\n\s*(\.|@)\w+(\(|(\s*:))/.test(l4) && />\s*<\w/.test(l4) === false || (/^\s*:root\s*\{/.test(l4) || /-{2}\w+\s*\{/.test(l4) || /^\s*(?:body|button|hr|section|h[1-6]|p|strong|\*)\s+\{\s+/.test(l4))))
    return t();
  c = l4.replace(/\[[a-zA-Z][\w-]*=['"]?[a-zA-Z][\w-]*['"]?\]/g, C).split(C);
  h = c.length;
  if (/^(\s*({{|{%|<))/.test(l4))
    return I();
  if (o === true || /^(?:[\s\w-]*<)/.test(l4) === false && /(?:>[\s\w-]*)$/.test(l4) === false)
    return _();
  return (/^(?:\s*<\?xml)/.test(l4) || /(?:>[\w\s:]*)?<(?:\/|!|#)?[\w\s:\-[]+/.test(l4) || /^\s*</.test(l4) && /<\/\w+(\w|\d)+>\s*$/.test(l4)) && (/^(?:[\s\w]*<)/.test(l4) || /(?:>[\s\w]*)$/.test(l4)) || /^(?:\s*<s((cript)|(tyle)))/i.test(l4) && /(?:<\/s((cript)|(tyle))>\s*)$/i.test(l4) ? /^(?:[\s\w]*<)/.test(l4) === false || /(?:>[\s\w]*)$/.test(l4) === false ? _() : I() : he("unknown");
}
T.lexers.markup = function l3(c) {
  const { options: h } = T;
  const { data: n } = s;
  const o = h.language === "jsx" || h.language === "tsx";
  const t = h.language === "html" || h.language === "liquid";
  const _ = h.markup;
  const I = _.attributeSortList.length;
  const S = { end: 0, index: -1, start: 0, line: 1 };
  const b = c.split(C);
  const a = b.length;
  let e = 0;
  let y = false;
  let F = "javascript";
  let i = t ? h.language : "html";
  let N = 0;
  function w(g) {
    if (t === true && o === false) {
      if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(g))
        return g;
      if (_.delimiterSpacing === true) {
        g = g.replace(/{[{%]-?\s*/g, (x) => x.replace(/\s*$/, " "));
        g = g.replace(/\s*-?[%}]}/g, (x) => x.replace(/^\s*/, " "));
      }
      return g;
    }
    return g;
  }
  function p(g, x, m) {
    if (g === n) {
      if (x.types.indexOf("end") > -1) {
        S.end = S.end + 1;
      } else if (x.types.indexOf("start") > -1) {
        S.start = S.start + 1;
      }
    }
    S.index = s.count;
    S.line = s.lineNumber;
    s.push(g, x, m);
  }
  function P(g) {
    let x = 0;
    let m = C;
    const A = /^(?:<|{%-?|{{-?)=?\s*/;
    if (typeof g !== "string")
      return C;
    x = g.replace(A, "%").replace(/\s+/, " ").indexOf(" ");
    m = g.replace(A, " ");
    m = x < 0 ? m.slice(1, g.length - 1) : m.slice(1, x);
    if (i === "html")
      m = m.toLowerCase();
    m = m.replace(/-?[%}]}$/, C);
    if (m.indexOf("(") > 0)
      m = m.slice(0, m.indexOf("("));
    if (m === "?xml?")
      return "xml";
    return m;
  }
  function U(g, x) {
    const m = P(g);
    const A = Ue({ begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "markup", lines: n.lines[s.count] > 0 ? 1 : 0, stack: s.structure[s.structure.length - 1][0], token: `</${s.structure[s.structure.length - 1][0]}>`, types: "end" });
    p(n, A, C);
    if (le.html.tags.has(s.structure[s.structure.length - 1][0]) && (x === true && s.structure.length > 1 || x === false && `/${s.structure[s.structure.length - 1][0]}` !== m)) {
      do {
        A.begin = s.structure[s.structure.length - 1][1];
        A.stack = s.structure[s.structure.length - 1][0];
        A.token = `</${s.structure[s.structure.length - 1][0]}>`;
        p(n, A, C);
      } while (le.html.tags.has(s.structure[s.structure.length - 1][0]) && (x === true && s.structure.length > 1 || x === false && `/${s.structure[s.structure.length - 1][0]}` !== m));
    }
  }
  function V(g) {
    const x = { begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "markup", lines: s.linesSpace, stack: s.structure[s.structure.length - 1][0], token: C, types: C };
    let m = 0;
    let A = C;
    let E = C;
    let $ = C;
    let q = C;
    let R = C;
    let ee = false;
    let z = false;
    let G = false;
    let Z = false;
    let te = false;
    let Q = false;
    let ne = false;
    let B = [];
    let H = [C, 0];
    function ge(j) {
      const u = j.indexOf("=");
      if (u > 0 && (u < j.indexOf('"') && j.indexOf('"') > 0 || u < j.indexOf("'") && j.indexOf("'") > 0)) {
        return [j.slice(0, u), j.slice(u + 1)];
      }
      return [j, C];
    }
    function pe() {
      const j = s.count;
      const u = q.replace(/(\/)$/, C);
      const r = _.quoteConvert;
      let k = 0;
      let v = 0;
      let O = 0;
      let L = C;
      let W = C;
      let ie = [];
      let D = B.length;
      function Y() {
        let se = Ae(x.token, 5);
        if (G === true || r === "none" || x.types.indexOf("attribute") < 0 || se === false && r === "single" && x.token.indexOf('"') < 0 || se === false && r === "double" && x.token.indexOf("'") < 0) {
          p(n, x, C);
        } else {
          let re = 0;
          let J = false;
          const K = x.token.split(C);
          const ue = x.token.indexOf("=");
          const be = K.length - 1;
          if (X(K[ue + 1], 34) && X(K[K.length - 1], 34) && r === "single" && se === false) {
            p(n, x, C);
          } else if (X(K[ue + 1], 39) && X(K[K.length - 1], 39) && r === "double" && se === false) {
            p(n, x, C);
          } else {
            re = ue + 2;
            if (r === "double") {
              if (x.token.slice(ue + 2, be).indexOf('"') > -1)
                J = true;
              K[ue + 1] = '"';
              K[K.length - 1] = '"';
            } else if (r === "single") {
              if (x.token.slice(ue + 2, be).indexOf("'") > -1)
                J = true;
              K[ue + 1] = "'";
              K[K.length - 1] = "'";
            }
            if (J === true || se === true) {
              se = false;
              do {
                if (d(K[re - 1], 123) && (d(K[re], 37) || d(K[re], 123))) {
                  se = true;
                } else if (d(K[re], 125) && (d(K[re - 1], 37) || d(K[re - 1], 125))) {
                  se = false;
                }
                if (se === true) {
                  if (d(K[re], 34) && r === "double") {
                    K[re] = "'";
                  } else if (d(K[re], 39) && r === "single") {
                    K[re] = '"';
                  }
                } else {
                  if (d(K[re], 39) && r === "double") {
                    K[re] = '"';
                  } else if (d(K[re], 34) && r === "single") {
                    K[re] = "'";
                  }
                }
                re = re + 1;
              } while (re < be);
            }
            x.token = K.join(C);
            p(n, x, C);
          }
        }
      }
      if (B.length < 1)
        return;
      if (d(B[B.length - 1][0], 47)) {
        B.pop();
        A = A.replace(/>$/, "/>");
      }
      v = B.length;
      O = 1;
      if (O < v) {
        do {
          L = B[O - 1][0];
          if (L.charCodeAt(L.length - 1) === 61 && B[O][0].indexOf("=") < 0) {
            B[O - 1][0] = L + B[O][0];
            B.splice(O, 1);
            v = v - 1;
            O = O - 1;
          }
          O = O + 1;
        } while (O < v);
      }
      if (_.attributeSort === true && o === false && Z === false && te === false) {
        if (I > 0) {
          const se = [];
          O = 0;
          v = 0;
          D = B.length;
          do {
            v = 0;
            do {
              L = B[v][0].split("=")[0];
              if (_.attributeSortList[O] === L) {
                se.push(B[v]);
                B.splice(v, 1);
                D = D - 1;
                break;
              }
              v = v + 1;
            } while (v < D);
            O = O + 1;
          } while (O < I);
          B = s.safeSort(B, C, false);
          B = se.concat(B);
          D = B.length;
        } else {
          B = s.safeSort(B, C, false);
        }
      }
      x.begin = j;
      x.stack = u;
      x.types = "attribute";
      ie = [];
      if (k < D) {
        do {
          if (B[k] === void 0)
            break;
          x.lines = B[k][1];
          B[k][0] = B[k][0].replace(/\s+$/, C);
          if (o === true && /^\/(\/|\*)/.test(B[k][0])) {
            x.types = "comment_attribute";
            x.token = B[k][0];
            Y();
            k = k + 1;
            continue;
          }
          if (d(B[k][0][0], 123) && d(B[k][0][1], 37) || d(B[k][0][B[k][0].length - 1], 125) && d(B[k][0][B[k][0].length - 2], 37)) {
            if (Pe(B[k][0])) {
              x.token = B[k][0];
              x.types = "template_attribute_end";
              x.ender = x.begin;
            } else {
              const se = Ie(B[k][0]);
              if (le.liquid.tags.has(se)) {
                x.types = "template_attribute_start";
                x.begin = s.count;
                x.token = B[k][0];
              } else if (le.liquid.else.has(se)) {
                x.types = "template_attribute_else";
                x.token = B[k][0];
              } else {
                x.types = "template_attribute";
                x.token = B[k][0];
              }
            }
            Y();
            k = k + 1;
            continue;
          }
          if (d(B[k][0][0], 123) && d(B[k][0][1], 123) || d(B[k][0][B[k][0].length - 1], 125) && d(B[k][0][B[k][0].length - 2], 125)) {
            if (Pe(B[k][0])) {
              x.token = B[k][0];
              x.types = "template_attribute_end";
              x.ender = x.begin;
            } else {
              const se = Ie(B[k][0]);
              if (le.liquid.tags.has(se)) {
                x.types = "template_attribute_start";
                x.begin = s.count;
                x.token = B[k][0];
              } else if (le.liquid.else.has(se)) {
                x.types = "template_attribute_else";
                x.token = B[k][0];
              } else {
                x.types = "template_attribute";
                x.token = B[k][0];
              }
            }
            Y();
            k = k + 1;
            continue;
          }
          v = B[k][0].indexOf("=");
          O = B[k][0].indexOf('"');
          B[k][0].indexOf("'");
          if (v < 0) {
            x.types = "attribute";
            if (d(B[k][0], 35) || d(B[k][0], 91) || d(B[k][0], 123) || d(B[k][0], 40) || o === true) {
              x.token = B[k][0];
            } else {
              if (_.attributeCasing === "preserve") {
                x.token = B[k][0];
              } else {
                x.token = B[k][0].toLowerCase();
              }
            }
            Y();
          } else {
            L = B[k][0].slice(0, v);
            W = B[k][0].slice(v + 1);
            if (_.correct && (X(W[0], 60) || X(W[0], 123) || X(W[0], 61) || X(W[0], 34) || X(W[0], 39))) {
              W = '"' + W + '"';
            }
            if (o === true && /^\s*{/.test(W)) {
              x.token = L + "={";
              x.types = "jsx_attribute_start";
              p(n, x, "jsx_attribute");
              T.lexers.script(W.slice(1, W.length - 1));
              x.begin = s.count;
              if (/\s\}$/.test(W)) {
                W = W.slice(0, W.length - 1);
                W = /\s+$/.exec(W)[0];
                x.lines = W.indexOf("\n") < 0 ? 1 : W.split("\n").length;
              } else {
                x.lines = 0;
              }
              x.begin = s.structure[s.structure.length - 1][1];
              x.stack = s.structure[s.structure.length - 1][0];
              x.token = "}";
              x.types = "jsx_attribute_end";
              Y();
              x.types = "attribute";
              x.begin = j;
              x.stack = u;
            } else {
              if (Pe(L) || (X(W, 39) || X(W, 34)) && Pe(W)) {
                x.token = B[k][0];
                x.types = "template_attribute_end";
                x.ender = x.begin;
              } else if (Ae(L, 5) && (X(W, 39) || X(W, 34)) && Ae(L, 5)) {
                const se = Ie(B[k][0]);
                if (le.liquid.tags.has(se)) {
                  x.types = "template_attribute_start";
                  x.begin = s.count;
                  x.token = B[k][0];
                } else if (le.liquid.else.has(se)) {
                  x.types = "template_attribute_else";
                  x.token = B[k][0];
                } else {
                  x.types = "template_attribute";
                  x.token = B[k][0];
                }
              } else {
                x.types = "attribute";
                if (d(B[k][0], 35) || d(B[k][0], 91) || d(B[k][0], 123) || d(B[k][0], 40) || o === true) {
                  x.token = B[k][0];
                } else {
                  x.token = B[k][0];
                }
              }
              Y();
            }
          }
          k = k + 1;
        } while (k < D);
      }
      if (ie.length > 0) {
        x.token = ie.join(" ");
        Y();
      }
    }
    y = false;
    if (g === "---") {
      R = "---";
      $ = "comment";
    } else if (d(b[e], 60)) {
      if (d(b[e + 1], 47)) {
        g = ">";
        $ = "end";
      } else if (d(b[e + 1], 33)) {
        if ((b[e + 2].charCodeAt(0) === 100 || b[e + 2].charCodeAt(0) === 68) && (b[e + 3].charCodeAt(0) === 111 || b[e + 3].charCodeAt(0) === 79) && (b[e + 4].charCodeAt(0) === 99 || b[e + 4].charCodeAt(0) === 67) && (b[e + 5].charCodeAt(0) === 116 || b[e + 5].charCodeAt(0) === 84) && (b[e + 6].charCodeAt(0) === 121 || b[e + 6].charCodeAt(0) === 89) && (b[e + 7].charCodeAt(0) === 112 || b[e + 7].charCodeAt(0) === 80) && (b[e + 8].charCodeAt(0) === 101 || b[e + 8].charCodeAt(0) === 69)) {
          g = ">";
          $ = "doctype";
          Q = true;
        } else if (d(b[e + 2], 45) && d(b[e + 3], 45)) {
          g = "-->";
          $ = "comment";
          R = "<!--";
        } else if (d(b[e + 2], 91) && b[e + 3].charCodeAt(0) === 67 && b[e + 4].charCodeAt(0) === 68 && b[e + 5].charCodeAt(0) === 65 && b[e + 6].charCodeAt(0) === 84 && b[e + 7].charCodeAt(0) === 65 && d(b[e + 8], 91)) {
          g = "]]>";
          $ = "cdata";
          Q = true;
        }
      } else if (b[e + 1] === "?") {
        g = "?>";
        if (b[e + 2].charCodeAt(0) === 120 && b[e + 3].charCodeAt(0) === 109 && b[e + 4].charCodeAt(0) === 109) {
          $ = "xml";
          ne = true;
        } else {
          Q = true;
          $ = "template";
        }
      } else if (d(b[e + 1], 37)) {
        Q = true;
      } else if ((b[e + 1].charCodeAt(0) === 112 || b[e + 1].charCodeAt(0) === 80) && (b[e + 2].charCodeAt(0) === 114 || b[e + 2].charCodeAt(0) === 82) && (b[e + 3].charCodeAt(0) === 101 || b[e + 3].charCodeAt(0) === 69) && (d(b[e + 4], 62) || oe(b[e + 4]))) {
        g = "</pre>";
        $ = "ignore";
        Q = true;
      } else {
        ne = true;
        g = ">";
      }
    } else if (d(b[e], 123)) {
      if (o) {
        y = true;
        z = true;
        x.token = "{";
        x.types = "script_start";
        s.structure.push(["script", s.count]);
        p(n, x, C);
        return;
      }
      if (d(b[e + 1], 123)) {
        Q = true;
        g = "}}";
        $ = "template";
      } else if (d(b[e + 1], 37)) {
        Q = true;
        g = "%}";
        $ = "template";
        const j = b.indexOf("}", e + 2);
        if (b[j - 1].charCodeAt(0) === 37) {
          let u = b.slice(e + 2, j - 1).join(C);
          if (u.charCodeAt(0) === 45) {
            R = "{%-";
            u = u.slice(1).trimStart();
          } else {
            R = "{%";
            u = u.trimStart();
          }
          if (u.charCodeAt(u.length - 1) === 45) {
            g = "-%}";
            u = u.slice(0, u.length - 1).trimEnd();
          } else {
            g = "%}";
            u = u.trimEnd();
          }
          if (u === "comment") {
            const r = c.indexOf("{%", j);
            let k = r;
            if (b[r + 1].charCodeAt(0) === 45)
              k = r + 1;
            k = c.indexOf("endcomment", k);
            if (k > 0) {
              k = b.indexOf("}", k);
              if (k > 0 && b[k - 1].charCodeAt(0) === 37) {
                $ = "comment";
                R = b.slice(e, j + 1).join(C);
                g = b.slice(r, k + 1).join(C);
              }
            }
          }
        } else {
          Q = true;
          g = "%}";
          $ = "template";
        }
      } else {
        Q = true;
        g = b[e + 1] + "}";
        $ = "template";
      }
    }
    if (_.preserveAttributes === true)
      Q = true;
    if (z)
      return;
    E = g.charAt(g.length - 1);
    if ($ === "comment" && (d(b[e], 60) || d(b[e], 123) && d(b[e + 1], 37))) {
      H = s.wrapCommentBlock({ chars: b, end: a, lexer: "markup", opening: R, start: e, terminator: g });
      A = H[0];
      e = H[1];
      if (A.replace(R, C).trimStart().startsWith("@prettify-ignore-start")) {
        x.token = A;
        x.types = "ignore";
        p(n, x, C);
        return;
      }
    } else if (e < a) {
      let K = function() {
        if (D === false && d(b[e - 1], 123) && (d(b[e], 123) || d(b[e], 37))) {
          return true;
        } else if (D === true && d(b[e], 125) && (d(b[e - 1], 125) || d(b[e - 1], 37))) {
          return false;
        }
        return D;
      }, ue = function() {
        let ae = e;
        do {
          ae = ae - 1;
        } while (b[ae] === "\\");
        ae = e - ae;
        return ae % 2 === 1;
      }, be = function(ae) {
        let de;
        let ce = C;
        let fe = 0;
        let Oe = 0;
        const Be = "data-prettify-ignore";
        if (ae === true) {
          ce = J.join(C);
          de = ge(ce);
          L = C;
          if (de[0] === Be)
            G = true;
        } else {
          ce = J.join(C);
          if (o === false || o && X(ce[ce.length - 1], 125)) {
            ce = ce.replace(/\s+/g, " ");
          }
          de = ge(ce);
          if (de[0] === Be)
            G = true;
          if (o && d(J[0], 123) && d(J[J.length - 1], 125))
            ie = 0;
        }
        if (d(ce[0], 123) && d(ce[1], 37))
          te = true;
        if (ae === false) {
          if (Xe(ce)) {
            N = N + 1;
          } else if (Pe(ce)) {
            N = N - 1;
          }
        }
        ce = ce.replace(/^\u0020/, C).replace(/\u0020$/, C);
        J = ce.replace(/\r\n/g, "\n").split("\n");
        Oe = J.length;
        if (fe < Oe) {
          do {
            J[fe] = J[fe].replace(/(\s+)$/, C);
            fe = fe + 1;
          } while (fe < Oe);
        }
        ce = J.join(h.crlf === true ? "\r\n" : "\n");
        ce = w(ce);
        if (N >= 1 || Ae(ce, 1)) {
          if (Ae(ce, 5) === false) {
            M = d(b[e + 1], 10) || d(b[e], 10) ? 2 : d(b[e], 32) && X(b[e + 1], 32) ? 1 : 0;
          } else {
            M = d(b[e + 1], 10) ? 2 : X(b[e + 1], 32) ? 0 : M;
          }
        }
        if (ce === "=") {
          B[B.length - 1][0] = `${B[B.length - 1][0]}=`;
        } else if (d(ce[0], 61) && B.length > 0 && B[B.length - 1][0].indexOf("=") < 0) {
          B[B.length - 1][0] = B[B.length - 1][0] + ce;
          if (N >= 1 || Ae(ce, 5))
            B[B.length - 1][1] = M;
        } else if (X(ce[0], 61) && B.length > 0 && B[B.length - 1][0].indexOf("=") === B[B.length - 1][0].length - 1) {
          B[B.length - 1][0] = B[B.length - 1][0] + ce;
        } else if (ce !== C && ce !== " ") {
          B.push([ce, M]);
        }
        if (B.length > 0) {
          const [He] = B[B.length - 1];
          if (He.indexOf("=\u201C") > 0) {
            s.error = `Invalid quote character (\u201C, &#x201c) used on line number ${s.lineNumber}`;
          } else if (He.indexOf("=\u201D") > 0) {
            s.error = `Invalid quote character (\u201D, &#x201d) used on line number ${s.lineNumber}`;
          }
        }
        J = [];
        M = b[e] === "\n" ? 2 : 1;
      };
      const j = [];
      let u = 0;
      let r = 0;
      let k = 0;
      let v = 0;
      let O = 0;
      let M = 0;
      let L = C;
      let W = C;
      let ie = 0;
      let D = false;
      let Y = false;
      let se = false;
      let re = false;
      let J = [];
      do {
        if (d(b[e], 10)) {
          M = M + 1;
          s.lineNumber = s.lineNumber + 1;
        }
        if (Q === true || (oe(b[e]) === false && X(L, 125) || d(L, 125))) {
          D = K();
          j.push(b[e]);
          if (d(j[0], 60) && d(j[1], 62) && d(g, 62)) {
            x.token = "<>";
            x.types = "start";
            p(n, x, "(empty)");
            return;
          }
          if (d(j[0], 60) && d(j[1], 47) && d(j[2], 62) && d(g, 62)) {
            x.token = "</>";
            x.types = "end";
            p(n, x, C);
            return;
          }
        }
        if ($ === "cdata" && d(b[e], 62) && d(b[e - 1], 93) && X(b[e - 2], 93)) {
          s.error = `CDATA tag (${j.join(C)}) not properly terminated with "]]>"`;
          break;
        }
        if ($ === "comment") {
          L = C;
          if (b[e] === E && j.length > g.length + 1) {
            r = j.length;
            u = g.length - 1;
            if (u > -1) {
              do {
                r = r - 1;
                if (j[r] !== g.charAt(u))
                  break;
                u = u - 1;
              } while (u > -1);
            }
            if (u < 0)
              break;
          }
        } else {
          if (L === C) {
            if (d(j[0], 60) && d(j[1], 33) && $ !== "cdata") {
              if ($ === "doctype" && d(b[e], 62))
                break;
              if (d(b[e], 91)) {
                if (d(b[e + 1], 60)) {
                  $ = "start";
                  break;
                }
                if (oe(b[e + 1])) {
                  do {
                    e = e + 1;
                    if (d(b[e], 10))
                      M = M + 1;
                  } while (e < a - 1 && oe(b[e + 1]));
                }
                if (d(b[e + 1], 60)) {
                  $ = "start";
                  break;
                }
              }
            }
            if (o) {
              if (d(b[e], 123)) {
                ie = ie + 1;
              } else if (d(b[e], 125)) {
                ie = ie - 1;
              }
            }
            if (d(b[e], 60) && Q === false && j.length > 1 && />{2,3}/.test(g) === false && ne) {
              s.error = `Parse error (line ${s.lineNumber}) on: ${j.join(C)}`;
            }
            if (Y === true && oe(b[e]) === false && b[e] !== E) {
              Y = false;
              m = 0;
              L = W;
              j.pop();
              if (e < a) {
                do {
                  if (d(b[e], 10))
                    s.lineNumber = s.lineNumber + 1;
                  if (_.preserveAttributes === true) {
                    j.push(b[e]);
                  } else {
                    J.push(b[e]);
                  }
                  if (X(L, 34) || X(L, 39)) {
                    if (d(b[e - 1], 123) && (d(b[e], 37) || d(b[e], 123))) {
                      D = true;
                    } else if ((d(b[e - 1], 125) || d(b[e - 1], 37)) && d(b[e], 125)) {
                      D = false;
                    }
                  }
                  if (o === false && se === false && D === true && _.preserveAttributes === false) {
                    const ae = d(J[0], 61);
                    do {
                      e = e + 1;
                      if (d(b[e], 10)) {
                        s.lineNumber = s.lineNumber + 1;
                        if (ae) {
                          D = false;
                          L = C;
                          be(false);
                          break;
                        }
                      }
                      J.push(b[e]);
                      if (ae && d(b[e + 1], 62)) {
                        D = false;
                        L = C;
                        B[B.length - 1][0] += J.join(C);
                        J = [];
                        break;
                      }
                      if (ae === false && (d(b[e - 1], 125) || d(b[e - 1], 37)) && d(b[e], 125)) {
                        D = false;
                        L = C;
                        be(false);
                        break;
                      }
                    } while (e < a);
                  }
                  if (o === false && (d(b[e], 60) || d(b[e], 62)) && (L === C || d(L, 62))) {
                    if (L === C && d(b[e], 60)) {
                      L = ">";
                      k = 1;
                    } else if (d(L, 62)) {
                      if (d(b[e], 60)) {
                        k = k + 1;
                      } else if (d(b[e], 62)) {
                        k = k - 1;
                        if (k === 0) {
                          L = C;
                          m = 0;
                          be(false);
                          break;
                        }
                      }
                    }
                  } else if (L === C) {
                    if (b[e + 1] === E) {
                      if (d(J[J.length - 1], 47) || d(J[J.length - 1], 63) && $ === "xml") {
                        J.pop();
                        if (Q === true)
                          j.pop();
                        e = e - 1;
                      }
                      if (J.length > 0)
                        be(false);
                      break;
                    }
                    if (o === false && d(b[e], 123) && d(b[e - 1], 61)) {
                      L = "}";
                    } else if (d(b[e], 34) || d(b[e], 39)) {
                      L = b[e];
                      if (se === false && D === false)
                        se = true;
                      if (d(b[e - 1], 61) && (d(b[e + 1], 60) || d(b[e + 1], 123) && d(b[e + 2], 37) || oe(b[e + 1]) && X(b[e - 1], 61))) {
                        m = e;
                      }
                    } else if (d(b[e], 40)) {
                      L = ")";
                      O = 1;
                    } else if (o) {
                      if ((d(b[e - 1], 61) || oe(b[e - 1])) && d(b[e], 123)) {
                        L = "}";
                        v = 1;
                      } else if (d(b[e], 47)) {
                        if (d(b[e + 1], 42)) {
                          L = "*/";
                        } else if (b[e + 1] === "/") {
                          L = "\n";
                        }
                      }
                    } else if (d(j[0], 123) && d(b[e], 123) && (d(b[e + 1], 123) || d(b[e + 1], 37))) {
                      L = d(b[e + 1], 123) ? "}}" : b[e + 1] + "}";
                    }
                    if (oe(b[e]) && L === C) {
                      if (d(J[J.length - 2], 61)) {
                        u = e + 1;
                        if (u < a) {
                          do {
                            if (oe(b[u]) === false) {
                              if (d(b[u], 34) || d(b[u], 39)) {
                                e = u - 1;
                                re = true;
                                J.pop();
                              }
                              break;
                            }
                            u = u + 1;
                          } while (u < a);
                        }
                      }
                      if (re === true) {
                        re = false;
                      } else if (ie === 0 || ie === 1 && d(J[0], 123)) {
                        J.pop();
                        if (J.length > 0)
                          be(false);
                        Y = true;
                        break;
                      }
                    }
                  } else if (d(b[e], 40) && d(L, 41)) {
                    O = O + 1;
                  } else if (d(b[e], 41) && d(L, 41)) {
                    O = O - 1;
                    if (O === 0) {
                      L = C;
                      if (b[e + 1] === g.charAt(0)) {
                        be(false);
                        break;
                      }
                    }
                  } else if (o && (d(L, 125) || d(L, 10) && d(b[e], 10) || L === "*/" && d(b[e - 1], 42) && d(b[e], 47))) {
                    if (d(b[e], 96)) {
                      e = e + 1;
                      do {
                        J.push(b[e]);
                        if (d(b[e], 96))
                          break;
                        e = e + 1;
                      } while (e < b.length);
                    }
                    if (d(L, 125)) {
                      if (d(b[e], 125) && b[e] !== L) {
                        v = v + 1;
                      } else if (b[e] === L) {
                        v = v - 1;
                        if (v === 0) {
                          ie = 0;
                          L = C;
                          A = J.join(C);
                          if (_.preserveAttributes === false) {
                            if (o) {
                              if (!/^\s*$/.test(A))
                                B.push([A, M]);
                            } else {
                              A = A.replace(/\s+/g, " ");
                              if (A !== " ")
                                B.push([A, M]);
                            }
                          }
                          J = [];
                          M = 1;
                          break;
                        }
                      }
                    } else {
                      W = C;
                      Z = true;
                      A = J.join(C);
                      if (A !== " ")
                        B.push([A, M]);
                      J = [];
                      M = d(L, 10) ? 2 : 1;
                      L = C;
                      break;
                    }
                  } else if (d(b[e], 123) && d(b[e + 1], 37) && d(b[m - 1], 61) && (d(L, 34) || d(L, 39))) {
                    L = L + "{%";
                    m = 0;
                  } else if (d(b[e - 1], 37) && d(b[e], 125) && (L === '"{%' || L === "'{%")) {
                    L = L.charAt(0);
                    m = 0;
                  } else if (d(b[e], 60) && d(g, 62) && d(b[m - 1], 61) && (d(L, 34) || d(L, 39))) {
                    L = L + "<";
                    m = 0;
                  } else if (d(b[e], 62) && (L === '"<' || L === "'<")) {
                    L = L.charAt(0);
                    m = 0;
                  } else if (m === 0 && X(L, 62) && (L.length < 2 || X(L, 34) && X(L, 39))) {
                    r = 0;
                    u = L.length - 1;
                    if (u > -1) {
                      do {
                        if (b[e - r].charCodeAt(0) !== L.charCodeAt(u))
                          break;
                        r = r + 1;
                        u = u - 1;
                      } while (u > -1);
                    }
                    if (u < 0 && D === false && se === true) {
                      se = false;
                      be(true);
                      if (b[e + 1] === E)
                        break;
                    }
                  } else if (m > 0 && oe(b[e]) === false) {
                    m = 0;
                  }
                  e = e + 1;
                } while (e < a);
              }
            } else if (d(g, 10) === false && (d(b[e], 34) || d(b[e], 39))) {
              L = b[e];
            } else if ($ !== "comment" && X(g, 10) && d(b[e], 60) && d(b[e + 1], 33) && d(b[e + 2], 45) && d(b[e + 3], 45) && n.types[s.count] !== "conditional") {
              L = "-->";
            } else if (d(b[e], 123) && X(j[0], 123) && X(g, 10) && (d(b[e + 1], 123) || d(b[e + 1], 37))) {
              if (d(b[e + 1], 123)) {
                L = "}}";
              } else {
                L = b[e + 1] + "}";
                if (J.length < 1 && (B.length < 1 || oe(b[e - 1]))) {
                  j.pop();
                  do {
                    if (d(b[e], 10))
                      M = M + 1;
                    J.push(b[e]);
                    e = e + 1;
                  } while (e < a && b[e - 1] + b[e] !== L);
                  J.push("}");
                  B.push([J.join(C), M]);
                  J = [];
                  M = 1;
                  L = C;
                }
              }
              if (L === g)
                L = C;
            } else if (ne && X(g, 10) && oe(b[e]) && X(b[e - 1], 60)) {
              Y = true;
            } else if (ne && o && d(b[e], 47) && (d(b[e + 1], 42) || d(b[e + 1], 47))) {
              Y = true;
              j[j.length - 1] = " ";
              W = d(b[e + 1], 42) ? "*/" : "\n";
              J.push(b[e]);
            } else if (D === false && (b[e] === E || d(g, 10) && d(b[e + 1], 60)) && (j.length > g.length + 1 || d(j[0], 93)) && (o === false || ie === 0)) {
              if (d(g, 10)) {
                if (oe(j[j.length - 1])) {
                  do {
                    j.pop();
                    e = e - 1;
                  } while (oe(j[j.length - 1]));
                }
                break;
              }
              r = j.length;
              u = g.length - 1;
              if (u > -1) {
                do {
                  r = r - 1;
                  if (j[r] !== g.charAt(u))
                    break;
                  u = u - 1;
                } while (u > -1);
              }
              if (u < 0) {
                if (d(j[r], 62) && d(b[e], 62) && B.length > 0) {
                  if (B[B.length - 1][1] === 0 && d(b[e - 1], 125) && oe(b[e + 1])) {
                    B[B.length - 1][1] = d(b[e + 1], 32) ? 1 : 2;
                  }
                }
                break;
              }
            }
          } else if (b[e].charCodeAt(0) === L.charCodeAt(L.length - 1) && (o && d(g, 125) && (b[e - 1] !== "\\" || ue() === false) || (o === false || X(g, 125)))) {
            r = 0;
            u = L.length - 1;
            if (u > -1) {
              do {
                if (b[e - r] !== L.charAt(u))
                  break;
                r = r + 1;
                u = u - 1;
              } while (u > -1);
            }
            if (u < 0)
              L = C;
          }
        }
        e = e + 1;
      } while (e < a);
      if (_.correct === true) {
        if (d(b[e + 1], 62) && d(j[0], 60) && X(j[0], 60)) {
          do {
            e = e + 1;
          } while (d(b[e + 1], 62));
        } else if (d(j[0], 60) && d(j[1], 60) && X(b[e + 1], 62) && X(j[j.length - 2], 62)) {
          do {
            j.splice(1, 1);
          } while (d(j[1], 60));
        }
      }
      m = 0;
      A = j.join(C);
      q = P(A);
      A = w(A);
      if (q === "xml") {
        i = "xml";
      } else if (i === C && q === "html") {
        i = "html";
      }
    }
    x.token = A;
    x.types = $;
    q = P(A);
    if (Q === false && o === false)
      A = A.replace(/\s+/g, " ");
    if (q === "comment" && Ae(A, 2)) {
      const j = A.slice(0, A.indexOf("%}") + 2);
      const u = A.slice(A.indexOf("%}") + 2, A.lastIndexOf("{%"));
      const r = A.slice(A.lastIndexOf("{%"));
      let k = 0;
      let v = 0;
      const O = (L) => {
        k = L === C ? 0 : L.split("\n").length;
        return C;
      };
      const M = (L) => {
        v = L === C ? 0 : L.split("\n").length;
        return C;
      };
      x.begin = s.structure[s.structure.length - 1][1];
      x.ender = s.count + 3;
      x.stack = s.structure[s.structure.length - 1][0];
      x.types = "template_start";
      x.token = j;
      p(n, x, "comment");
      A = u.replace(/^\s*/, O);
      A = A.replace(/\s*$/, M);
      x.begin = s.count;
      x.lines = k;
      x.stack = "comment";
      x.token = A;
      x.types = "comment";
      p(n, x, C);
      x.types = "template_end";
      x.stack = "comment";
      x.lines = v;
      x.token = r;
      p(n, x, C);
      return;
    }
    x.types = $;
    ee = (() => {
      const j = /(\/>)$/;
      const u = (k, v) => {
        if (!le.html.tags.has(k))
          return false;
        if (k === v)
          return true;
        if (k === "dd" && v === "dt")
          return true;
        if (k === "dt" && v === "dd")
          return true;
        if (k === "td" && v === "th")
          return true;
        if (k === "th" && v === "td")
          return true;
        if (k === "colgroup" && (v === "tbody" || v === "tfoot" || v === "thead" || v === "tr"))
          return true;
        if (k === "tbody" && (v === "colgroup" || v === "tfoot" || v === "thead"))
          return true;
        if (k === "tfoot" && (v === "colgroup" || v === "tbody" || v === "thead"))
          return true;
        if (k === "thead" && (v === "colgroup" || v === "tbody" || v === "tfoot"))
          return true;
        if (k === "tr" && v === "colgroup")
          return true;
        return false;
      };
      const r = (k) => {
        x.lines = n.lines[s.count] > 0 ? 1 : 0;
        x.token = `</${s.structure[s.structure.length - 1][0]}>`;
        x.types = "end";
        p(n, x, C);
        if (k > 0) {
          do {
            x.begin = s.structure[s.structure.length - 1][1];
            x.stack = s.structure[s.structure.length - 1][0];
            x.token = `</${s.structure[s.structure.length - 1][0]}>`;
            p(n, x, C);
            k = k - 1;
          } while (k > 0);
        }
        x.begin = s.structure[s.structure.length - 1][1];
        x.lines = s.linesSpace;
        x.stack = s.structure[s.structure.length - 1][0];
        x.token = A;
        x.types = "end";
        n.lines[s.count - 1] = 0;
      };
      if ($ === "end") {
        const k = n.token[s.count];
        if (n.types[s.count - 1] === "singleton" && k.charCodeAt(k.length - 2) !== 47 && `/${P(k)}` === q) {
          n.types[s.count - 1] = "start";
        }
      }
      if (i === "html") {
        if (d(A[0], 60) && X(A[1], 33) && X(A[1], 63) && (s.count < 0 || n.types[s.count].indexOf("template") < 0))
          A = A.toLowerCase();
        if (le.html.tags.has(s.structure[s.structure.length - 1][0]) && u(q.slice(1), s.structure[s.structure.length - 2][0])) {
          r(0);
        } else if (s.structure.length > 3 && le.html.tags.has(s.structure[s.structure.length - 1][0]) && le.html.tags.has(s.structure[s.structure.length - 2][0]) && le.html.tags.has(s.structure[s.structure.length - 3][0]) && u(q, s.structure[s.structure.length - 4][0])) {
          r(3);
        } else if (s.structure.length > 2 && le.html.tags.has(s.structure[s.structure.length - 1][0]) && le.html.tags.has(s.structure[s.structure.length - 2][0]) && u(q, s.structure[s.structure.length - 3][0])) {
          r(2);
        } else if (s.structure.length > 1 && le.html.tags.has(s.structure[s.structure.length - 1][0]) && u(q, s.structure[s.structure.length - 2][0])) {
          r(1);
        } else if (u(q, s.structure[s.structure.length - 1][0])) {
          r(0);
        } else if (d(q[0], 47) && le.html.tags.has(s.structure[s.structure.length - 1][0]) && s.structure[s.structure.length - 1][0] !== q.slice(1)) {
          U(A, false);
          x.begin = s.structure[s.structure.length - 1][1];
          x.lines = s.linesSpace;
          x.stack = s.structure[s.structure.length - 1][0];
          x.token = A;
          x.types = "end";
          n.lines[s.count - 1] = 0;
        }
        if (o === false && le.html.voids.has(q)) {
          if (_.correct === true && j.test(A) === false)
            A = A.slice(0, A.length - 1) + " />";
          return true;
        }
      }
      return false;
    })();
    if (le.embed("html", q) && A.slice(A.length - 2) !== "/>" || le.embed("liquid", q) && A.slice(A.length - 2) === "%}") {
      const j = Ae(A, 3);
      let u = B.length - 1;
      let r = C;
      let k = [];
      if (u > -1) {
        do {
          k = ge(B[u][0]);
          if (k[0] === "type") {
            r = k[1];
            if (r.charCodeAt(0) === 34 || r.charCodeAt(0) === 39) {
              r = r.slice(1, r.length - 1);
            }
            break;
          }
          u = u - 1;
        } while (u > -1);
      }
      if (j === false && le.embed("html", q)) {
        y = true;
        if (r === C) {
          F = le.html.embed[q].language;
        } else if (le.html.embed[q].value(r)) {
          F = le.html.embed[q].language;
        }
      } else if (j === true && le.embed("liquid", q)) {
        y = true;
        if (r === C) {
          F = le.liquid.embed[q].language;
        } else {
          F = le.liquid.embed[q].language;
        }
      }
      if (y === true) {
        u = e + 1;
        if (u < a) {
          do {
            if (oe(b[u]) === false) {
              if (d(b[u], 60)) {
                if (b.slice(u + 1, u + 4).join(C) === "!--") {
                  u = u + 4;
                  if (u < a) {
                    do {
                      if (oe(b[u]) === false) {
                        y = false;
                        break;
                      }
                      if (b[u] === "\n" || b[u] === "\r")
                        break;
                      u = u + 1;
                    } while (u < a);
                  }
                } else {
                  y = false;
                }
              }
              break;
            }
            u = u + 1;
          } while (u < a);
        }
      }
    }
    if (ne && G === false && $ !== "xml") {
      if (ee === true || A.slice(A.length - 2) === "/>") {
        $ = "singleton";
      } else {
        $ = "start";
      }
      x.types = $;
    }
    if (ne && Q === false && G && d(g, 62) && A.slice(A.length - 2) !== "/>") {
      const j = [];
      const u = [];
      if (ee === true) {
        $ = "singleton";
      } else {
        B.forEach((r) => u.push(r[0]));
        Q = true;
        $ = "ignore";
        e = e + 1;
        if (e < a) {
          let r = C;
          let k = 0;
          let v = 0;
          let O = false;
          do {
            if (d(b[e], 10))
              s.lineNumber = s.lineNumber + 1;
            j.push(b[e]);
            if (r === C) {
              if (d(b[e], 34)) {
                r = '"';
              } else if (d(b[e], 39)) {
                r = "'";
              } else if (X(j[0], 123) && d(b[e], 123) && (d(b[e + 1], 123) || d(b[e + 1], 37))) {
                if (d(b[e + 1], 123)) {
                  r = "}}";
                } else {
                  r = b[e + 1] + "}";
                }
              } else if (d(b[e], 60) && ne === true) {
                if (d(b[e + 1], 47)) {
                  O = true;
                } else {
                  O = false;
                }
              } else if (b[e] === E && X(b[e - 1], 47)) {
                if (O === true) {
                  m = m - 1;
                  if (m < 0)
                    break;
                } else {
                  m = m + 1;
                }
              }
            } else if (d(b[e], r.charCodeAt(r.length - 1))) {
              v = 0;
              k = r.length - 1;
              if (k > -1) {
                do {
                  if (X(b[e - v], r.charCodeAt(k)))
                    break;
                  v = v + 1;
                  k = k - 1;
                } while (k > -1);
              }
              if (k < 0)
                r = C;
            }
            e = e + 1;
          } while (e < a);
        }
      }
      A = A + j.join(C);
      A = A.replace(">", ` ${u.join(" ")}>`);
      x.token = A;
      x.types = "content-ignore";
      B = [];
    }
    if (x.types.indexOf("template") > -1) {
      if (d(A[0], 123) && d(A[1], 37)) {
        if ((q === "case" || q === "default") && (s.structure[s.structure.length - 1][0] === "switch" || s.structure[s.structure.length - 1][0] === "case")) {
          x.types = "template_else";
        } else if (le.liquid.else.has(q)) {
          x.types = "template_else";
        } else {
          if (le.liquid.tags.has(q)) {
            x.types = "template_start";
          } else if (q.charCodeAt(0) === 101 && q.charCodeAt(1) === 110 && q.charCodeAt(2) === 100 && le.liquid.tags.has(q.slice(3))) {
            x.types = "template_end";
          } else if (q.charCodeAt(0) === 101 && q.charCodeAt(1) === 110 && q.charCodeAt(2) === 100) {
            x.types = "template_end";
            x.stack = q.slice(3);
            let j = 0;
            do {
              if (n.types[j] === "template" && n.stack[j] === x.stack) {
                n.types[j] = "template_start";
                S.start = S.start + 1;
                break;
              } else {
                j = n.stack.indexOf(x.stack, j + 1);
              }
            } while (j > -1);
          } else {
            x.stack = q;
          }
        }
      } else if (x.types === "template") {
        if (A.indexOf("else") > 2)
          x.types = "template_else";
      }
      if (x.types === "template_start" || x.types === "template_else") {
        if (q === C || d(q, 37)) {
          q = q + A.slice(1).replace(q, C).replace(/^\s+/, C);
          q = q.slice(0, q.indexOf("(")).replace(/\s+/, C);
        }
      }
      if (_.quoteConvert === "double") {
        x.token = x.token.replace(/'/g, '"');
      } else if (_.quoteConvert === "single") {
        x.token = x.token.replace(/"/g, "'");
      }
    }
    if ($ === "cdata" && (x.stack === "script" || x.stack === "style")) {
      let j = s.count;
      let u = s.count;
      const r = x.stack;
      if (n.types[u] === "attribute") {
        do {
          j = j - 1;
          u = u - 1;
        } while (n.types[u] === "attribute" && u > -1);
      }
      x.begin = j;
      x.token = "<![CDATA[";
      x.types = "cdata_start";
      A = A.replace(/^(\s*<!\[cdata\[)/i, C).replace(/(\]\]>\s*)$/, C);
      p(n, x, C);
      s.structure.push(["cdata", s.count]);
      if (r === "script") {
        T.lexers.script(A);
      } else {
        T.lexers.style(A);
      }
      x.begin = s.structure[s.structure.length - 1][1];
      x.token = "]]>";
      x.types = "cdata_end";
      p(n, x, C);
      s.structure.pop();
    } else {
      p(n, x, q);
    }
    pe();
    if (h.wrap > 0 && o === true) {
      let j = 0;
      let u = s.count;
      let r = 0;
      if (n.types[u].indexOf("attribute") > -1) {
        do {
          j = j + n.token[u].length + 1;
          u = u - 1;
        } while (n.lexer[u] !== "markup" || n.types[u].indexOf("attribute") > -1);
        if (n.lines[u] === 1)
          j = j + n.token[u].length + 1;
      } else if (n.lines[u] === 1) {
        j = n.token[u].length + 1;
      }
      r = u - 1;
      if (j > 0 && n.types[r] !== "script_end") {
        if (n.types[r].indexOf("attribute") > -1) {
          do {
            j = j + n.token[r].length + 1;
            r = r - 1;
          } while (n.lexer[r] !== "markup" || n.types[r].indexOf("attribute") > -1);
          if (n.lines[r] === 1)
            j = j + n.token[r].length + 1;
        } else if (n.lines[r] === 1) {
          j = n.token[r].length + 1;
        }
      }
    }
    s.linesSpace = 0;
  }
  function f() {
    const g = [];
    const x = e;
    const m = d(n.token[s.count], 123) && o === true;
    let A = C;
    let E = s.linesSpace;
    let $ = C;
    if (y === true) {
      if (m === true) {
        $ = "script";
      } else if (s.structure[s.structure.length - 1][1] > -1) {
        $ = P(n.token[s.structure[s.structure.length - 1][1]].toLowerCase());
      } else if (n.begin[s.count] > 1) {
        $ = P(n.token[n.begin[s.count]].toLowerCase());
      } else {
        $ = P(n.token[n.begin[s.count]].toLowerCase());
      }
    }
    const q = n.types[s.count] === "template_start" && n.token[s.count].indexOf("<!") === 0 && n.token[s.count].indexOf("<![") < 0 && n.token[s.count].charCodeAt(n.token[s.count].length - 1) === 91;
    const R = { begin: s.structure[s.structure.length - 1][1], ender: -1, lexer: "markup", lines: E, stack: s.structure[s.structure.length - 1][0], token: C, types: "content" };
    function ee() {
      let z = e - 1;
      let G = 0;
      if (b[e - 1] !== "\\")
        return false;
      if (z > -1) {
        do {
          if (b[z] !== "\\")
            break;
          G = G + 1;
          z = z - 1;
        } while (z > -1);
      }
      return G % 2 === 1;
    }
    if (e < a) {
      let z = C;
      let G = C;
      let Z = C;
      let te = 0;
      do {
        if (d(b[e], 10))
          s.lineNumber = s.lineNumber + 1;
        if (y === true) {
          if (G === C) {
            if (d(b[e], 47)) {
              if (d(b[e + 1], 42)) {
                G = "*";
              } else if (d(b[e + 1], 47)) {
                G = "/";
              } else if ($ === "script" && "([{!=,;.?:&<>".indexOf(b[e - 1]) > -1) {
                if (o === false || X(b[e - 1], 60))
                  G = "reg";
              }
            } else if ((d(b[e], 34) || d(b[e], 39) || d(b[e], 96)) && ee() === false) {
              G = b[e];
            } else if (d(b[e], 123) && m === true) {
              te = te + 1;
            } else if (d(b[e], 125) && m === true) {
              if (te === 0) {
                Z = g.join(C).replace(/^\s+/, C).replace(/\s+$/, C);
                T.lexers.script(Z);
                s.structure[s.structure.length - 1][1] += 1;
                if (n.types[s.count] === "end" && n.lexer[n.begin[s.count] - 1] === "script") {
                  R.lexer = "script";
                  R.token = _.correct === true ? ";" : "x;";
                  R.types = "separator";
                  p(n, R, C);
                  R.lexer = "markup";
                }
                R.token = "}";
                R.types = "script_end";
                p(n, R, C);
                s.structure.pop();
                break;
              }
              te = te - 1;
            }
            if (Ae(n.token[s.count], 3) === false) {
              z = b.slice(e, e + 10).join(C).toLowerCase();
              if ($ === "script") {
                z = e === a - 9 ? z.slice(0, z.length - 1) : z.slice(0, z.length - 2);
                if (z === "<\/script") {
                  Z = g.join(C).replace(/^\s+/, C).replace(/\s+$/, C);
                  e = e - 1;
                  if (g.length < 1)
                    break;
                  if (/^<!--+/.test(Z) && /--+>$/.test(Z)) {
                    R.token = "<!--";
                    R.types = "comment";
                    p(n, R, C);
                    Z = Z.replace(/^<!--+/, C).replace(/--+>$/, C);
                    T.lexers.script(Z);
                    R.token = "-->";
                    p(n, R, C);
                  } else {
                    T.options.language = F;
                    T.lexers.script(Z);
                    if (F === "json" && h.json.objectSort === true || F !== "json" && h.script.objectSort === true)
                      s.sortCorrection(0, s.count + 1);
                    T.options.language = "html";
                  }
                  break;
                }
              }
              if ($ === "style") {
                if (e === a - 8) {
                  z = z.slice(0, z.length - 1);
                } else if (e === a - 9) {
                  z = z.slice(0, z.length - 2);
                } else {
                  z = z.slice(0, z.length - 3);
                }
                if (z === "</style") {
                  let Q = g.join(C).replace(/^\s+/, C).replace(/\s+$/, C);
                  e = e - 1;
                  if (g.length < 1)
                    break;
                  if (/^<!--+/.test(Q) && /--+>$/.test(Q)) {
                    R.token = "<!--";
                    R.types = "comment";
                    p(n, R, C);
                    Q = Q.replace(/^<!--+/, C).replace(/--+>$/, C);
                    T.lexers.style(Q);
                    R.token = "-->";
                    p(n, R, C);
                  } else {
                    T.options.language = F;
                    T.lexers.style(Q);
                    if (h.style.sortProperties === true)
                      s.sortCorrection(0, s.count + 1);
                    T.options.language = "html";
                  }
                  break;
                }
              }
            } else {
              if (le.embed("liquid", $)) {
                z = b.slice(e).join(C).toLowerCase();
                if (le.liquid.embed[$].end(z)) {
                  z = z.slice(0, z.indexOf("%}") + 2);
                  Z = g.join(C).replace(/^\s+/, C).replace(/\s+$/, C);
                  e = e + z.length - 1;
                  if (g.length < 1)
                    break;
                  const Q = We[le.liquid.embed[$].language];
                  if (/^<!--+/.test(Z) && /--+>$/.test(Z)) {
                    R.token = "<!--";
                    R.types = "comment";
                    p(n, R, C);
                    Z = Z.replace(/^<!--+/, C).replace(/--+>$/, C);
                    T.lexers[Q](Z);
                    R.token = "-->";
                    p(n, R, C);
                  } else {
                    T.options.language = le.liquid.embed[$].language;
                    T.lexers[Q](Z);
                    if (F === "json" && h.json.objectSort === true || F === "javascript" && h.script.objectSort === true || (F === "css" || F === "scss") && h.style.sortProperties === true)
                      s.sortCorrection(0, s.count + 1);
                    T.options.language = "liquid";
                    R.token = z;
                    R.types = "template_end";
                    p(n, R, C);
                  }
                  break;
                }
              }
            }
          } else if (G === b[e] && (d(G, 34) || d(G, 39) || d(G, 96) || d(G, 42) && d(b[e + 1], 47)) && ee() === false) {
            G = C;
          } else if (d(G, 96) && b[e] === "$" && d(b[e + 1], 123) && ee() === false) {
            G = "}";
          } else if (d(G, 125) && d(b[e], 125) && ee() === false) {
            G = "`";
          } else if (d(G, 47) && (d(b[e], 10) || b[e] === "\r")) {
            G = C;
          } else if (G === "reg" && d(b[e], 47) && ee() === false) {
            G = C;
          } else if (d(G, 47) && d(b[e], 60) && d(b[e - 1], 45) && d(b[e - 2], 45)) {
            z = b.slice(e + 1, e + 11).join(C).toLowerCase();
            z = z.slice(0, z.length - 2);
            if ($ === "script" && z === "<\/script")
              G = C;
            z = z.slice(0, z.length - 1);
            if ($ === "style" && z === "</style")
              G = C;
          }
        }
        if (q === true && d(b[e], 93)) {
          e = e - 1;
          E = 0;
          A = g.join(C);
          A = A.replace(/\s+$/, C);
          R.token = A;
          p(n, R, C);
          break;
        }
        if (y === false && g.length > 0 && (d(b[e], 60) && X(b[e + 1], 61) && !/\s|\d/.test(b[e + 1]) || d(b[e], 91) && d(b[e + 1], 37) || d(b[e], 123) && (o === true || d(b[e + 1], 123) || d(b[e + 1], 37)))) {
          e = e - 1;
          if (s.structure[s.structure.length - 1][0] === "comment") {
            A = g.join(C);
          } else {
            A = g.join(C).replace(/\s+$/, C);
          }
          A = w(A);
          E = 0;
          R.token = A;
          if (h.wrap > 0 && _.preserveText === false) {
            const { wrap: Q } = h;
            const ne = C;
            const ke = C;
            const B = [];
            let H = Q;
            let ge = A.length;
            const ye = () => {
              if (A.charCodeAt(H) === 32) {
                B.push(A.slice(0, H));
                A = A.slice(H + 1);
                ge = A.length;
                H = Q;
                return;
              }
              do {
                H = H - 1;
              } while (H > 0 && A.charCodeAt(H) !== 32);
              if (H > 0) {
                B.push(A.slice(0, H));
                A = A.slice(H + 1);
                ge = A.length;
                H = Q;
              } else {
                H = Q;
                do {
                  H = H + 1;
                } while (H < ge && A.charCodeAt(H) !== 32);
                B.push(A.slice(0, H));
                A = A.slice(H + 1);
                ge = A.length;
                H = Q;
              }
            };
            if (n.token[n.begin[s.count]] === "<a>" && n.token[n.begin[n.begin[s.count]]] === "<li>" && n.lines[n.begin[s.count]] === 0 && s.linesSpace === 0 && A.length < h.wrap) {
              p(n, R, C);
              break;
            }
            if (ge < Q) {
              p(n, R, C);
              break;
            }
            if (s.linesSpace < 1) {
              let pe = s.count;
              do {
                H = H - n.token[pe].length;
                if (n.types[pe].indexOf("attribute") > -1)
                  H = H - 1;
                if (n.lines[pe] > 0 && n.types[pe].indexOf("attribute") < 0)
                  break;
                pe = pe - 1;
              } while (pe > 0 && H > 0);
              if (H < 1)
                H = A.indexOf(" ");
            }
            A = g.join(C);
            A = A.replace(/^\s+/, C).replace(/\s+$/, C).replace(/\s+/g, " ");
            do {
              ye();
            } while (H < ge);
            if (A !== C && X(A, 32))
              B.push(A);
            A = h.crlf === true ? B.join("\r\n") : B.join("\n");
            A = ne + A + ke;
          }
          E = 0;
          R.token = A;
          p(n, R, C);
          break;
        }
        g.push(b[e]);
        e = e + 1;
      } while (e < a);
    }
    if (e > x && e < a) {
      if (oe(b[e])) {
        let z = e;
        s.linesSpace = 1;
        do {
          if (b[z] === "\n")
            s.linesSpace = s.linesSpace + 1;
          z = z - 1;
        } while (z > x && oe(b[z]));
      } else {
        s.linesSpace = 0;
      }
    } else if (e !== x || e === x && y === false) {
      A = g.join(C).replace(/\s+$/, C);
      E = 0;
      if (R.token !== A) {
        R.token = A;
        p(n, R, C);
        s.linesSpace = 0;
      }
    }
    y = false;
  }
  if (I > 0) {
    do {
      _.attributeSortList[e] = _.attributeSortList[e].replace(/^\s+/, C).replace(/\s+$/, C);
      e = e + 1;
    } while (e < I);
    e = 0;
  }
  if (h.language === "html" || h.language === "liquid")
    i = "html";
  do {
    if (oe(b[e])) {
      if (n.types[s.count] === "template_start" && s.structure[s.structure.length - 1][0] === "comment") {
        f();
      } else {
        e = s.spacer({ array: b, end: a, index: e });
      }
    } else if (y) {
      f();
    } else if (d(b[e], 60)) {
      V(C);
    } else if (d(b[e], 91) && d(b[e + 1], 37)) {
      V("%]");
    } else if (d(b[e], 123) && (o || d(b[e + 1], 123) || d(b[e + 1], 37))) {
      V(C);
    } else if (d(b[e], 45) && d(b[e + 1], 45) && d(b[e + 2], 45)) {
      V("---");
    } else {
      f();
    }
    e = e + 1;
  } while (e < a);
  if (X(n.token[s.count][0], 47) && le.html.tags.has(s.structure[s.structure.length - 1][0]))
    U(n.token[s.count], true);
  if (S.end !== S.start && s.error === C) {
    if (S.end > S.start) {
      const g = S.end - S.start;
      const x = g === 1 ? C : "s";
      s.error = ["Prettify Error:", "", `${g} more end type${x} than start types`].join("\n");
    } else {
      const g = S.start - S.end;
      const x = g === 1 ? C : "s";
      s.error = ["Prettify Error:", "", `${g} more start type${x} than end types`].join("\n");
    }
  }
  return n;
};
T.beautify.markup = (l4) => {
  const c = {};
  const h = "markup";
  const { data: n } = s;
  const o = l4.language === "jsx" || l4.language === "tsx";
  const t = l4.crlf === true ? String.fromCharCode(13, 10) : String.fromCharCode(10);
  const _ = l4.markup;
  const I = T.end < 1 || T.end > n.token.length ? n.token.length : T.end + 1;
  const S = { is: (w, p) => n.types[w] === p, not: (w, p) => n.types[w] !== p, idx: (w, p) => w > -1 && (n.types[w] || C).indexOf(p) };
  const b = { is: (w, p) => n.token[w] === p, not: (w, p) => n.token[w] !== p };
  let a = T.start;
  let e = -1;
  let y = 0;
  let F = 0;
  let i = isNaN(l4.indentLevel) ? 0 : Number(l4.indentLevel);
  const N = (() => {
    const w = T.start > 0 ? Array(T.start).fill(0, 0, T.start) : [];
    function p() {
      let x = a + 1;
      let m = 0;
      if (S.is(x, void 0))
        return x - 1;
      if (S.is(x, "comment") || a < I - 1 && S.idx(x, "attribute") > -1) {
        do {
          if (S.is(x, "jsx_attribute_start")) {
            m = x;
            do {
              if (S.is(x, "jsx_attribute_end") && n.begin[x] === m)
                break;
              x = x + 1;
            } while (x < I);
          } else if (S.not(x, "comment") && S.idx(x, "attribute") < 0)
            return x;
          x = x + 1;
        } while (x < I);
      }
      return x;
    }
    function P() {
      const x = n.begin[a];
      let m = a;
      do {
        m = m - 1;
        if (b.is(m, "</li>") && b.is(m - 1, "</a>") && n.begin[n.begin[m]] === x && n.begin[m - 1] === n.begin[m] + 1) {
          m = n.begin[m];
        } else {
          return;
        }
      } while (m > x + 1);
      m = a;
      do {
        m = m - 1;
        if (S.is(m + 1, "attribute")) {
          w[m] = -10;
        } else if (b.not(m, "</li>")) {
          w[m] = -20;
        }
      } while (m > x + 1);
    }
    function U() {
      let x = a;
      let m = false;
      if (n.lines[a + 1] === 0 && _.forceIndent === false) {
        do {
          if (n.lines[x] > 0) {
            m = true;
            break;
          }
          x = x - 1;
        } while (x > e);
        x = a;
      } else {
        m = true;
      }
      if (m === true) {
        const A = S.is(y, "comment") || S.is(y, "end") || S.is(y, "template_end") ? i + 1 : i;
        do {
          w.push(A);
          x = x - 1;
        } while (x > e);
        if (A === i + 1)
          w[a] = i;
        if (S.is(x, "attribute") || S.is(x, "template_attribute") || S.is(x, "jsx_attribute_start")) {
          w[n.begin[x]] = A;
        } else {
          w[x] = A;
        }
      } else {
        do {
          w.push(-20);
          x = x - 1;
        } while (x > e);
        w[x] = -20;
      }
      e = -1;
    }
    function V() {
      let x = i;
      if (_.forceIndent === true || _.forceAttribute === true) {
        w.push(i);
        return;
      }
      if (y < I && (S.idx(y, "end") > -1 || S.idx(y, "start") > -1) && n.lines[y] > 0) {
        w.push(i);
        x = x + 1;
        if (S.is(a, "singleton") && a > 0 && S.idx(a - 1, "attribute") > -1 && S.is(n.begin[a - 1], "singleton")) {
          if (n.begin[a] < 0 || S.is(n.begin[a - 1], "singleton") && n.begin[n.ender[a] - 1] !== a) {
            w[a - 1] = i;
          } else {
            w[a - 1] = i + 1;
          }
        }
      } else if (a > 0 && S.is(a, "singleton") && S.idx(a - 1, "attribute") > -1) {
        w[a - 1] = i;
        F = n.token[a].length;
        w.push(-10);
      } else if (n.lines[y] === 0) {
        w.push(-20);
      } else if ((l4.wrap === 0 || a < I - 2 && n.token[a] !== void 0 && n.token[a + 1] !== void 0 && n.token[a + 2] !== void 0 && n.token[a].length + n.token[a + 1].length + n.token[a + 2].length + 1 > l4.wrap && S.idx(a + 2, "attribute") > -1 || n.token[a] !== void 0 && n.token[a + 1] !== void 0 && n.token[a].length + n.token[a + 1].length > l4.wrap) && (S.is(a + 1, "singleton") || S.is(a + 1, "template"))) {
        w.push(i);
      } else {
        F = F + 1;
        w.push(-10);
      }
      if (a > 0 && S.idx(a - 1, "attribute") > -1 && n.lines[a] < 1) {
        w[a - 1] = -20;
      }
      if (F > l4.wrap) {
        let m = a;
        let A = Math.max(n.begin[a], 0);
        if (S.is(a, "content") && _.preserveText === false) {
          let E = 0;
          const $ = n.token[a].replace(/\s+/g, " ").split(" ");
          do {
            m = m - 1;
            if (w[m] < 0) {
              E = E + n.token[m].length;
              if (w[m] === -10)
                E = E + 1;
            } else {
              break;
            }
          } while (m > 0);
          m = 0;
          A = $.length;
          do {
            if ($[m].length + E > l4.wrap) {
              $[m] = t + $[m];
              E = $[m].length;
            } else {
              $[m] = ` ${$[m]}`;
              E = E + $[m].length;
            }
            m = m + 1;
          } while (m < A);
          if (d($[0], 32)) {
            n.token[a] = $.join(C).slice(1);
          } else {
            w[a - 1] = x;
            n.token[a] = $.join(C).replace(t, C);
          }
          if (n.token[a].indexOf(t) > 0) {
            F = n.token[a].length - n.token[a].lastIndexOf(t);
          }
        } else {
          do {
            m = m - 1;
            if (w[m] > -1) {
              F = n.token[a].length;
              if (n.lines[a + 1] > 0)
                F = F + 1;
              return;
            }
            if (S.idx(m, "start") > -1) {
              F = 0;
              return;
            }
            if (n.lines[m + 1] > 0 && (S.not(m, "attribute") || S.is(m, "attribute") && S.is(m + 1, "attribute"))) {
              if (S.not(m, "singleton") || S.is(m, "attribute") && S.is(m + 1, "attribute")) {
                F = n.token[a].length;
                if (n.lines[a + 1] > 0)
                  F = F + 1;
                break;
              }
            }
          } while (m > A);
          w[m] = x;
        }
      }
    }
    function f() {
      const x = a;
      if (n.types[x - 1] === "script_start" && d(n.token[x - 1], 123)) {
        w[x - 1] = -20;
      }
      do {
        if (n.lexer[a + 1] === h && n.begin[a + 1] < x && S.not(a + 1, "start") && S.not(a + 1, "singleton"))
          break;
        w.push(0);
        a = a + 1;
      } while (a < I);
      c[x] = a;
      if (n.types[a + 1] === "script_end" && n.token[a + 1] === "}") {
        w.push(-20);
      } else {
        w.push(i - 1);
      }
      y = p();
      if (n.lexer[y] === h && n.stack[a].indexOf("attribute") < 0 && (n.types[y] === "end" || n.types[y] === "template_end")) {
        i = i - 1;
      }
    }
    function g() {
      function x(Z) {
        const te = Z.indexOf("=");
        if (te > 0 && (te < Z.indexOf('"') && Z.indexOf('"') > 0 || te < Z.indexOf("'") && Z.indexOf("'") > 0)) {
          return [Z.slice(0, te), Z.slice(te + 1)];
        }
        return [Z, C];
      }
      function m(Z) {
        const te = x(Z);
        if (te[1] === C || te[0] === "href" || te[0].charCodeAt(0) === 111 && te[0].charCodeAt(1) === 110) {
          return Z;
        } else if (_.attributeValues === "preserve") {
          return te[0] + "=" + te[1];
        } else if (_.attributeValues === "strip") {
          return `${te[0].trimStart()}=${te[1].replace(/\s+/g, " ").replace(/^["']\s+/, '"')}`;
        }
        const Q = _.attributeValues;
        const ne = [];
        const ke = l4.wrap > 0 ? te[1].length > l4.wrap : false;
        let B;
        let H = false;
        let ge = C;
        let ye = C;
        let pe = 0;
        let Se = 0;
        if (Q === "collapse") {
          B = te[1].replace(/\s+/g, " ");
        } else if (Q === "wrap") {
          B = te[1].replace(/\s+/g, ($e) => /\n/.test($e) ? "\n" : $e.replace(/\s+/, " "));
        }
        do {
          if (d(B[pe], 123) && (d(B[pe + 1], 123) || d(B[pe + 1], 37))) {
            if (Q === "collapse") {
              if (oe(B[pe - 1]) === true && ne[ne.length - 1] !== "\n") {
                ne.push("\n");
              }
            }
            if (d(B[pe + 1], 37)) {
              Se = B.indexOf("%}", pe + 1);
              ge = B.slice(pe, Se + 2);
              ye = d(ge[2], 45) ? ge.slice(3).trimStart() : ge.slice(2).trimStart();
              pe = Se + 2;
              if (ye.startsWith("end")) {
                H = false;
                if (Q === "collapse" && ne[ne.length - 1] !== "\n") {
                  ne.push("\n");
                }
              } else if (le.liquid.tags.has(ye.slice(0, ye.search(/\s/)))) {
                H = true;
                if (Q === "collapse" && ne[ne.length - 1] !== "\n") {
                  ne.push("\n");
                }
              }
              ne.push(ge);
            } else {
              if (H && Q === "collapse" && ne[ne.length - 1] !== "\n") {
                ne.push("\n");
              }
              Se = B.indexOf("}}", pe + 1);
              ge = B.slice(pe, Se + 2);
              pe = Se + 2;
              ne.push(ge);
            }
            if (Q === "collapse") {
              if (oe(B[pe]) === true && ne[ne.length - 1] !== "\n" && pe < B.length - 1) {
                ne.push("\n");
              }
            }
          } else {
            if (B[pe] === " ") {
              if (Q === "collapse") {
                if (ne[ne.length - 1] !== "\n") {
                  ne.push("\n");
                }
              } else if (ke && Q === "wrap") {
                if (H === false) {
                  ne.push("\n");
                }
              }
            } else {
              ne.push(B[pe]);
            }
            pe = pe + 1;
          }
        } while (pe < B.length);
        return te[0] + "=" + ne.join(C);
      }
      function A(Z) {
        if (S.is(Z, "attribute") || S.idx(Z, "template_attribute") > -1) {
          n.token[Z] = m(n.token[Z]);
        } else {
          const te = n.token[Z].replace(/\s+/g, " ").split(" ");
          const Q = te.length;
          let ne = 1;
          let ke = te[0].length;
          do {
            if (ke + te[ne].length > l4.wrap) {
              ke = te[ne].length;
              te[ne] = t + te[ne];
            } else {
              te[ne] = ` ${te[ne]}`;
              ke = ke + te[ne].length;
            }
            ne = ne + 1;
          } while (ne < Q);
          n.token[Z] = te.join(C);
        }
      }
      let E = a;
      const $ = a - 1;
      let q = false;
      let R = false;
      let ee = 0;
      let z = n.token[$].length + 1;
      let G = (() => {
        if (S.idx(a, "start") > 0) {
          let Z = a;
          do {
            if (n.types[Z].indexOf("end") > 0 && n.begin[Z] === a) {
              if (Z < I - 1 && S.idx(Z + 1, "attribute") > -1) {
                q = true;
                break;
              }
            }
            Z = Z + 1;
          } while (Z < I);
        } else if (a < I - 1 && S.idx(a + 1, "attribute") > -1) {
          q = true;
        }
        if (S.is(y, "end") || S.is(y, "template_end")) {
          return i + (S.is($, "singleton") ? 2 : 1);
        }
        if (S.is($, "singleton"))
          return i + 1;
        return i;
      })();
      if (q === false && S.is(a, "comment_attribute")) {
        w.push(i);
        w[$] = n.types[$] === "singleton" ? i + 1 : i;
        return;
      }
      if (G < 1)
        G = 1;
      do {
        F = F + n.token[a].length + 1;
        if (n.types[a].indexOf("attribute") > 0) {
          if (n.types[a] === "template_attribute_start") {
            if (_.preserveAttributes === true) {
              w.push(-10);
            } else {
              let Z = 1;
              do {
                if (n.lines[a] === 0) {
                  w.push(-20);
                } else if (n.lines[a] === 1) {
                  if (_.forceAttribute === true) {
                    w.push(G);
                  } else {
                    w.push(-10);
                  }
                } else {
                  w.push(G);
                }
                if (Z === 0)
                  break;
                a = a + 1;
                if (S.is(a, "template_attribute_start")) {
                  Z = Z + 1;
                } else if (S.is(a, "template_attribute_end")) {
                  Z = Z - 1;
                }
                ee = ee + 1;
                if (n.token[a] !== void 0) {
                  F = F + n.token[a].length + 1;
                  z = z + n.token[a].length + 1;
                }
              } while (a < I);
            }
          } else if (n.types[a] === "template_attribute") {
            if (_.forceAttribute === true) {
              w.push(G);
            } else {
              w.push(-10);
            }
          } else if (n.types[a] === "comment_attribute") {
            w.push(G);
          } else if (n.types[a].indexOf("start") > 0) {
            R = true;
            if (a < I - 2 && n.types[a + 2].indexOf("attribute") > 0) {
              w.push(-20);
              a = a + 1;
              c[a] = a;
            } else {
              if ($ === a - 1 && q === false) {
                if (o) {
                  w.push(-20);
                } else {
                  w.push(G);
                }
              } else {
                if (o) {
                  w.push(-20);
                } else {
                  w.push(G + 1);
                }
              }
              if (n.lexer[a + 1] !== h) {
                a = a + 1;
                f();
              }
            }
          } else if (n.types[a].indexOf("end") > 0 && n.types[a].indexOf("template") < 0) {
            if (w[a - 1] !== -20)
              w[a - 1] = w[n.begin[a]] - 1;
            if (n.lexer[a + 1] !== h) {
              w.push(-20);
            } else {
              w.push(G);
            }
          } else {
            w.push(G);
          }
        } else if (S.is(a, "attribute")) {
          z = z + n.token[a].length + 1;
          if (_.preserveAttributes === true) {
            w.push(-10);
          } else if (_.forceAttribute === true || _.forceAttribute >= 1 || R === true || a < I - 1 && (S.idx(a + 1, "template_attribute_") > -1 && n.lines[a + 1] !== -20 || S.idx(a + 1, "attribute") > 0)) {
            n.token[a] = m(n.token[a]);
            if (_.forceAttribute === false && n.lines[a] === 1) {
              if (S.is(a + 1, "template_attribute_start") && n.lines[a + 1] > 1) {
                w.push(G);
              } else {
                w.push(-10);
              }
            } else {
              w.push(G);
            }
          } else {
            w.push(-10);
          }
        } else if (n.begin[a] < $ + 1) {
          break;
        }
        a = a + 1;
        ee = ee + 1;
      } while (a < I);
      a = a - 1;
      if (S.idx(a, "template") < 0 && S.idx(a, "end") > 0 && S.idx(a, "attribute") > 0 && S.not($, "singleton") && w[a - 1] > 0 && q === true) {
        w[a - 1] = w[a - 1] - 1;
      }
      if (w[a] !== -20) {
        if (o === true && S.idx($, "start") > -1 && S.is(a + 1, "script_start")) {
          w[a] = G;
        } else {
          if (b.is(a, "/") && w[a - 1] !== 10) {
            w[a - 1] = -10;
          } else {
            w[a] = w[$];
          }
        }
      }
      if (_.forceAttribute === true) {
        F = 0;
        w[$] = G;
      } else if (_.forceAttribute >= 1) {
        if (ee >= _.forceAttribute) {
          w[$] = G;
        } else {
          w[$] = -10;
        }
      } else {
        w[$] = -10;
      }
      if (_.preserveAttributes === true || b.is($, "<%xml%>") || b.is($, "<?xml?>")) {
        F = 0;
        return;
      }
      E = a;
      if (E > $ + 1) {
        if (_.selfCloseSpace === false)
          z = z - 1;
        if (z > l4.wrap && l4.wrap > 0 && _.forceAttribute === false) {
          if (_.forceLeadAttribute === true) {
            w[$] = G;
            E = E - 1;
          }
          F = n.token[a].length;
          do {
            if (n.token[E].length > l4.wrap && oe(n.token[E]))
              A(E);
            if (S.idx(E, "template") > -1 && w[E] === -10) {
              w[E] = G;
            } else if (S.is(E, "attribute") && w[E] === -10) {
              w[E] = G;
            }
            E = E - 1;
          } while (E > $);
        }
      } else if (l4.wrap > 0 && S.is(a, "attribute") && n.token[a].length > l4.wrap && oe(n.token[a])) {
        A(a);
      }
    }
    do {
      if (n.lexer[a] === h) {
        if (n.token[a].toLowerCase().indexOf("<!doctype") === 0)
          w[a - 1] = i;
        if (n.types[a].indexOf("attribute") > -1) {
          g();
        } else if (S.is(a, "comment")) {
          if (e < 0)
            e = a;
          if (S.not(a + 1, "comment") || a > 0 && S.idx(a - 1, "end") > -1)
            U();
        } else if (S.not(a, "comment")) {
          y = p();
          if (S.is(y, "end") || S.is(y, "template_end")) {
            i = i - 1;
            if (S.is(y, "template_end") && S.is(n.begin[y] + 1, "template_else"))
              i = i - 1;
            if (b.is(a, "</ol>") || b.is(a, "</ul>") || b.is(a, "</dl>"))
              P();
          }
          if (S.is(a, "script_end") && S.is(a + 1, "end")) {
            if (n.lines[y] < 1) {
              w.push(-20);
            } else if (n.lines[y] > 1) {
              w.push(i);
            } else {
              w.push(-10);
            }
          } else if ((_.forceIndent === false || _.forceIndent === true && S.is(y, "script_start")) && (S.is(a, "content") || S.is(a, "singleton") || S.is(a, "template"))) {
            F = F + n.token[a].length;
            if (S.is(a, "template")) {
              w.push(i);
              const x = n.token[a].indexOf(t);
              if (x > 0) {
                const m = [];
                const A = w[a - 1] * l4.indentSize + n.token[a].charCodeAt(2) === 45 ? l4.indentSize : l4.indentSize - 1;
                let E = 0;
                do {
                  m.push(" ");
                  E = E + 1;
                } while (E < A);
                n.token[a] = n.token[a].replace(/^\s+/gm, C).replace(/\n/g, ($) => `${$}${m.join(C)}`);
              }
            } else if (n.lines[y] > 0 && S.is(y, "script_start")) {
              w.push(-10);
            } else if (l4.wrap > 0 && (S.idx(a, "template") < 0 || y < I && S.idx(a, "template") > -1 && S.idx(a, "template") < 0)) {
              V();
            } else if (y < I && (S.idx(y, "end") > -1 || S.idx(y, "start") > -1) && (n.lines[y] > 0 || S.idx(a, "template_") > -1)) {
              w.push(i);
            } else if (n.lines[y] === 0) {
              w.push(-20);
            } else {
              w.push(i);
            }
          } else if (S.is(a, "start") || S.is(a, "template_start")) {
            i = i + 1;
            if (S.is(a, "template_start") && S.is(a + 1, "template_else")) {
              i = i + 1;
            }
            if (o === true && b.is(a + 1, "{")) {
              if (n.lines[y] === 0) {
                w.push(-20);
              } else if (n.lines[y] > 1) {
                w.push(i);
              } else {
                w.push(-10);
              }
            } else if (S.is(a, "start") && S.is(y, "end")) {
              w.push(-20);
            } else if (S.is(a, "start") && S.is(y, "script_start")) {
              w.push(-10);
            } else if (_.forceIndent === true) {
              w.push(i);
            } else if (S.is(a, "template_start") && S.is(y, "template_end")) {
              w.push(-20);
            } else if (n.lines[y] === 0 && (S.is(y, "content") || S.is(y, "singleton") || S.is(y, "start") && S.is(y, "template"))) {
              w.push(-20);
            } else {
              w.push(i);
            }
          } else if (_.forceIndent === false && n.lines[y] === 0 && (S.is(y, "content") || S.is(y, "singleton"))) {
            w.push(-20);
          } else if (S.is(a + 2, "script_end")) {
            w.push(-20);
          } else if (S.is(a, "template_else")) {
            if (S.is(y, "template_end")) {
              w[a - 1] = i + 1;
            } else {
              w[a - 1] = i - 1;
            }
            w.push(i);
          } else {
            w.push(i);
          }
        }
        if (S.not(a, "content") && S.not(a, "singleton") && S.not(a, "template") && S.not(a, "attribute")) {
          F = 0;
        }
      } else {
        F = 0;
        f();
      }
      a = a + 1;
    } while (a < I);
    return w;
  })();
  return (() => {
    const w = [];
    const p = (() => {
      const g = [l4.indentChar];
      const x = l4.indentSize - 1;
      let m = 0;
      if (m < x) {
        do {
          g.push(l4.indentChar);
          m = m + 1;
        } while (m < x);
      }
      return g.join(C);
    })();
    function P(g) {
      const x = [];
      const m = l4.preserveLine + 1;
      const A = Math.min(n.lines[a + 1] - 1, m);
      let E = 0;
      if (g < 0)
        g = 0;
      do {
        x.push(t);
        E = E + 1;
      } while (E < A);
      if (g > 0) {
        E = 0;
        do {
          x.push(p);
          E = E + 1;
        } while (E < g);
      }
      return x.join(C);
    }
    function U() {
      let g = n.token[a].split(t);
      const x = n.lines[a + 1];
      if (S.is(a, "comment"))
        g = g.map(($) => $.trimStart());
      const m = N[a - 1] > -1 ? S.is(a, "attribute") ? N[a - 1] + 1 : N[a - 1] : (() => {
        let $ = a - 1;
        let q = $ > -1 && S.idx($, "start") > -1;
        if (N[a] > -1 && S.is(a, "attribute")) {
          return N[a] + 1;
        }
        do {
          $ = $ - 1;
          if (N[$] > -1) {
            return S.is(a, "content") && q === false ? N[$] : N[$] + 1;
          }
          if (S.idx($, "start") > -1)
            q = true;
        } while ($ > 0);
        return $ === -2 ? 0 : 1;
      })();
      let A = 0;
      n.lines[a + 1] = 0;
      const E = g.length - 1;
      do {
        if (S.is(a, "comment")) {
          if (g[A] !== C) {
            if (g[A + 1].trimStart() !== C) {
              w.push(g[A], P(m));
            } else {
              w.push(g[A], "\n");
            }
          } else {
            if (g[A + 1].trimStart() === C) {
              w.push("\n");
            } else {
              w.push(P(m));
            }
          }
        } else {
          w.push(g[A]);
          w.push(P(m));
        }
        A = A + 1;
      } while (A < E);
      n.lines[a + 1] = x;
      w.push(g[E]);
      if (N[a] === -10) {
        w.push(" ");
      } else if (N[a] > 1) {
        w.push(P(N[a]));
      }
    }
    function V() {
      const g = /\/?>$/;
      const x = n.token[a];
      const m = g.exec(x);
      if (m === null)
        return;
      let A = a + 1;
      let E = false;
      let $ = _.selfCloseSpace === true && m !== null && m[0] === "/>" ? " " : C;
      n.token[a] = x.replace(g, C);
      do {
        if (S.is(A, "jsx_attribute_end") && n.begin[n.begin[A]] === a) {
          E = false;
        } else if (n.begin[A] === a) {
          if (S.is(A, "jsx_attribute_start")) {
            E = true;
          } else if (S.idx(A, "attribute") < 0 && E === false) {
            break;
          }
        } else if (E === false && (n.begin[A] < a || S.idx(A, "attribute") < 0)) {
          break;
        }
        A = A + 1;
      } while (A < I);
      if (S.is(A - 1, "comment_attribute"))
        $ = P(N[A - 2] - 1);
      n.token[A - 1] = `${n.token[A - 1]}${$}${m[0]}`;
      if (S.is(A, "comment") && n.lines[a + 1] < 2)
        N[a] = -10;
    }
    a = T.start;
    let f = l4.indentLevel;
    do {
      if (n.lexer[a] === h) {
        if ((S.is(a, "start") || S.is(a, "singleton") || S.is(a, "xml")) && S.idx(a, "attribute") < 0 && a < I - 1 && n.types[a + 1] !== void 0 && S.idx(a + 1, "attribute") > -1) {
          V();
        }
        if (b.not(a, void 0) && n.token[a].indexOf(t) > 0 && (S.is(a, "content") && _.preserveText === false || S.is(a, "comment") || S.is(a, "attribute"))) {
          U();
        } else {
          w.push(n.token[a]);
          if (N[a] === -10 && a < I - 1) {
            w.push(" ");
          } else if (N[a] > -1) {
            f = N[a];
            w.push(P(N[a]));
          }
        }
      } else {
        if (c[a] === a && S.not(a, "reference")) {
          w.push(n.token[a]);
        } else {
          T.end = c[a];
          l4.indentLevel = f;
          T.start = a;
          w.push(T.beautify[n.lexer[a]](l4).replace(/\s+$/, C));
          if (N[T.iterator] > -1 && c[a] > a) {
            w.push(P(N[T.iterator]));
          }
          a = T.iterator;
          l4.indentLevel = 0;
        }
      }
      a = a + 1;
    } while (a < I);
    T.iterator = I - 1;
    if (w[0] === t || d(w[0], 32))
      w[0] = C;
    return w.join(C);
  })();
};
T.beautify.style = (l4) => {
  const c = [];
  const h = T.data;
  const n = l4.crlf === true ? "\r\n" : "\n";
  const o = T.end > 0 ? T.end + 1 : h.token.length;
  const t = l4.preserveLine + 1;
  const _ = je(l4.indentSize);
  const I = (() => {
    let i = 0;
    const N = [];
    do {
      N.push(l4.indentChar);
      i = i + 1;
    } while (i < l4.indentSize);
    return N.join(C);
  })();
  let S = l4.indentLevel;
  let b = l4.style.forceValue === "wrap" && l4.wrap > 0 ? l4.wrap : 0;
  let a = T.start;
  let e = [C, C];
  function y(i) {
    const N = [];
    const w = (() => {
      if (a === o - 1)
        return 1;
      if (h.lines[a + 1] - 1 > t)
        return t;
      if (h.lines[a + 1] > 1)
        return h.lines[a + 1] - 1;
      return 1;
    })();
    let p = 0;
    if (i < 0)
      i = 0;
    do {
      N.push(n);
      p = p + 1;
      b = S;
    } while (p < w);
    if (i > 0) {
      p = 0;
      do {
        N.push(I);
        p = p + 1;
      } while (p < i);
    }
    c.push(N.join(C));
  }
  function F() {
    const i = h.begin[a];
    const N = h.token[i];
    const w = h.token[a];
    const p = [];
    let P = a;
    let U = 0;
    let V;
    let f = 0;
    if (i < 0 || P <= i)
      return;
    do {
      P = P - 1;
      if (h.begin[P] === i) {
        if (d(h.token[P], 58)) {
          V = [P - 1, 0];
          do {
            P = P - 1;
            if ((d(h.token[P], 59) && N === "{" || d(h.token[P], 44) && N === "(") && h.begin[P] === i || h.token[P] === w && h.begin[h.begin[P]] === i) {
              break;
            }
            if (h.types[P] !== "comment" && h.types[P] !== "selector" && h.token[P] !== N && h.begin[P] === i) {
              V[1] = h.token[P].length + V[1];
            }
          } while (P > i + 1);
          if (V[1] > f)
            f = V[1];
          p.push(V);
        }
      } else if (h.types[P] === "end") {
        if (P < h.begin[P])
          break;
        P = h.begin[P];
      }
    } while (P > i);
    P = p.length;
    if (P < 2)
      return;
    do {
      P = P - 1;
      if (p[P][1] < f) {
        U = p[P][1];
        do {
          h.token[p[P][0]] = h.token[p[P][0]] + " ";
          U = U + 1;
        } while (U < f);
      }
    } while (P > 0);
  }
  if (l4.script.vertical === true && l4.style.compressCSS === false) {
    a = o;
    do {
      a = a - 1;
      if (d(h.token[a], 125) || d(h.token[a], 41))
        F();
    } while (a > 0);
    a = T.start;
  }
  do {
    if (h.types[a] === "property")
      b = S + h.token[a].length;
    if (h.types[a + 1] === "end" || h.types[a + 1] === "template_end" || h.types[a + 1] === "template_else") {
      S = S - 1;
    }
    if (h.types[a] === "template" && h.lines[a] === 0) {
      c.push(h.token[a]);
      if (h.types[a + 1] === "template" && h.lines[a + 1] > 0)
        y(S);
    } else if (h.types[a] === "template" && h.lines[a] > 0) {
      if (h.types[a - 2] !== "property" && h.types[a - 1] !== "colon") {
        b = S;
        c.push(h.token[a]);
        y(S);
      } else if (h.types[a - 2] === "property" && h.types[a - 1] === "colon" && h.types[a + 1] === "separator" && d(h.token[a + 1], 44)) {
        b = b + h.token[a].length;
        if (b > l4.wrap)
          y(S);
        c.push(h.token[a]);
        do {
          a = a + 1;
          c.push(h.token[a]);
          if (h.lines[a + 1] > 0)
            y(S);
        } while (h.types[a] !== "separator" && X(h.token[a], 59));
        if (d(h.token[a], 59) && h.types[a] === "separator") {
          c.push(h.token[a]);
          if (h.lines[a + 1] > 0)
            y(S);
          a = a + 1;
          continue;
        }
      } else {
        b = b + h.token[a].length;
        if (b > l4.wrap || l4.style.forceValue === "collapse") {
          y(S);
          if (X(h.token[a][2], 45)) {
            c.push(_, h.token[a].replace("{{", "{{-"));
          } else {
            c.push(_, h.token[a]);
          }
        } else {
          c.push(h.token[a]);
        }
      }
    } else if (h.types[a] === "template_else") {
      c.push(h.token[a]);
      S = S + 1;
      y(S);
    } else if (h.types[a] === "start" || h.types[a] === "template_start") {
      S = S + 1;
      c.push(h.token[a]);
      if (h.types[a + 1] !== "end" && h.types[a + 1] !== "template_end" && (l4.style.compressCSS === false || l4.style.compressCSS === true && h.types[a + 1] === "selector")) {
        y(S);
      }
    } else if (d(h.token[a], 59) && (l4.style.compressCSS === false || l4.style.compressCSS === true && h.types[a + 1] === "selector") || (h.types[a] === "end" || h.types[a] === "template_end" || h.types[a] === "comment")) {
      c.push(h.token[a]);
      if (h.types[a + 1] === "value") {
        if (h.lines[a + 1] === 1) {
          c.push(" ");
        } else if (h.lines[a + 1] > 1) {
          y(S);
        }
      } else if (h.types[a + 1] !== "separator") {
        if (h.types[a + 1] !== "comment" || h.types[a + 1] === "comment" && h.lines[a + 1] > 1) {
          y(S);
        } else {
          c.push(" ");
        }
      }
    } else if (d(h.token[a], 58)) {
      c.push(h.token[a]);
      if (l4.style.compressCSS === false)
        c.push(" ");
    } else if (h.types[a] === "selector") {
      if (l4.style.classPadding === true && h.types[a - 1] === "end" && h.lines[a] < 3) {
        c.push(n);
      }
      if (h.token[a].indexOf("and(") > 0) {
        h.token[a] = h.token[a].replace(/and\(/, "and (");
        c.push(h.token[a]);
      } else if (h.token[a].indexOf("when(") > 0) {
        e = h.token[a].split("when(");
        c.push(e[0].replace(/\s+$/, C));
        y(S + 1);
        c.push(`when (${e[1]}`);
      } else {
        c.push(h.token[a]);
      }
      if (h.types[a + 1] === "start") {
        if (l4.script.braceAllman === true) {
          y(S);
        } else if (l4.style.compressCSS === false) {
          c.push(" ");
        }
      }
    } else if (d(h.token[a], 44)) {
      c.push(h.token[a]);
      if (h.types[a + 1] === "selector" || h.types[a + 1] === "property") {
        y(S);
      } else if (l4.style.compressCSS === false) {
        c.push(" ");
      }
    } else if (h.stack[a] === "map" && d(h.token[a + 1], 41) && a - h.begin[a] > 5) {
      c.push(h.token[a]);
      y(S);
    } else if (h.token[a] === "x;") {
      y(S);
    } else if ((h.types[a] === "variable" || h.types[a] === "function") && l4.style.classPadding === true && h.types[a - 1] === "end" && h.lines[a] < 3) {
      c.push(n);
      c.push(h.token[a]);
    } else if (X(h.token[a], 59) || d(h.token[a], 59) && (l4.style.compressCSS === false || l4.style.compressCSS === true && X(h.token[a + 1], 125))) {
      c.push(h.token[a]);
    }
    a = a + 1;
  } while (a < o);
  T.iterator = o - 1;
  return c.join(C);
};
T.beautify.script = (l4) => {
  const c = /* @__PURE__ */ new Set(["ActiveXObject", "ArrayBuffer", "AudioContext", "Canvas", "CustomAnimation", "DOMParser", "DataView", "Date", "Error", "EvalError", "FadeAnimation", "FileReader", "Flash", "Float32Array", "Float64Array", "FormField", "Frame", "Generator", "HotKey", "Image", "Iterator", "Intl", "Int16Array", "Int32Array", "Int8Array", "InternalError", "Loader", "Map", "MenuItem", "MoveAnimation", "Notification", "ParallelArray", "Point", "Promise", "Proxy", "RangeError", "Rectangle", "ReferenceError", "Reflect", "RegExp", "ResizeAnimation", "RotateAnimation", "Set", "SQLite", "ScrollBar", "Set", "Shadow", "StopIteration", "Symbol", "SyntaxError", "Text", "TextArea", "Timer", "TypeError", "URL", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray", "URIError", "WeakMap", "WeakSet", "Web", "Window", "XMLHttpRequest"]);
  const o = xe(null);
  const t = T.data;
  const _ = "script";
  const I = T.scopes;
  const S = T.end < 1 || T.end > t.token.length ? t.token.length : T.end + 1;
  const b = (() => {
    let e = T.start;
    let y = isNaN(l4.indentLevel) ? 0 : Number(l4.indentLevel);
    let F = false;
    let i = false;
    let N = "";
    let w = "";
    let p = t.types[0];
    let P = t.token[0];
    const U = [-1];
    const V = [];
    const f = T.start > 0 ? Array(T.start).fill(0, 0, T.start) : [];
    const g = [];
    const x = [[]];
    const m = [];
    const A = [];
    const E = [];
    const $ = [false];
    const q = [];
    const R = [];
    function ee() {
      z(false, false);
      const j = l4.commentIndent === true ? y : 0;
      if (F === false && /\/\u002a\s*global\s/.test(t.token[e])) {
        const u = t.token[e].replace(/\/\u002a\s*global\s+/, "").replace(/\s*\u002a\/$/, "").split(",");
        let r = u.length;
        do {
          r = r - 1;
          u[r] = u[r].replace(/\s+/g, "");
          if (u[r] !== "")
            I.push([u[r], -1]);
        } while (r > 0);
      }
      if (t.types[e - 1] === "comment" || t.types[e + 1] === "comment") {
        f[e - 1] = j;
      } else if (t.lines[e] < 2) {
        let u = e + 1;
        if (t.types[u] === "comment") {
          do {
            u = u + 1;
          } while (u < S && t.types[u] === "comment");
        }
        if (e < S - 1 && t.stack[u] !== "block" && (t.token[u] === "{" || t.token[u] === "x{")) {
          let r = I.length;
          t.begin.splice(e, 0, t.begin[u]);
          t.ender.splice(e, 0, t.ender[u]);
          t.lexer.splice(e, 0, t.lexer[u]);
          t.lines.splice(e, 0, t.lines[u]);
          t.stack.splice(e, 0, t.stack[u]);
          t.token.splice(e, 0, t.token[u]);
          t.types.splice(e, 0, t.types[u]);
          if (r > 0) {
            do {
              r = r - 1;
              if (I[r][1] === u) {
                I[r][1] = e;
              } else if (I[r][1] < e) {
                break;
              }
            } while (r > 0);
          }
          u = u + 1;
          t.begin.splice(u, 1);
          t.ender.splice(u, 1);
          t.lexer.splice(u, 1);
          t.lines.splice(u, 1);
          t.stack.splice(u, 1);
          t.token.splice(u, 1);
          t.types.splice(u, 1);
          r = e + 1;
          do {
            t.begin[r] = e;
            t.stack[r] = t.stack[u];
            r = r + 1;
          } while (r < u);
          r = r + 1;
          do {
            if (t.begin[r] === t.begin[u]) {
              t.begin[r] = e;
              if (t.types[r] === "end") {
                break;
              }
            }
            r = r + 1;
          } while (r < S - 1);
          t.begin[u] = e;
          e = e - 1;
        } else {
          f[e - 1] = -10;
          if (t.stack[e] === "paren" || t.stack[e] === "method") {
            f.push(y + 2);
          } else {
            f.push(y);
          }
          if (l4.commentIndent === true && f[e] > -1 && t.lines[e] < 3) {
            t.lines[e] = 3;
          }
        }
        if (t.types[e + 1] !== "comment")
          F = true;
        return;
      } else if (t.token[e - 1] === ",") {
        f[e - 1] = j;
      } else if (P === "=" && t.types[e - 1] !== "comment" && /^(\/\*\*\s*@[a-z_]+\s)/.test(w) === true) {
        f[e - 1] = -10;
      } else if (P === "{" && t.types[e - 1] !== "comment" && t.lines[0] < 2) {
        if (t.stack[e] === "function") {
          f[e - 1] = j;
        } else {
          f[e - 1] = /\n/.test(w) ? j : -10;
        }
      } else {
        f[e - 1] = j;
      }
      if (t.types[e + 1] !== "comment")
        F = true;
      if (t.token[t.begin[e]] === "(") {
        f.push(y + 1);
      } else {
        f.push(y);
      }
      if (f[e] > -1 && t.lines[e] < 3) {
        if (t.types[e - 1] === "comment" && w.startsWith("//")) {
          t.lines[e] = 2;
        } else {
          t.lines[e] = 3;
        }
      }
      if (l4.script.commentNewline === true && w.startsWith("//") === false && t.lines[e] >= 3) {
        t.lines[e] = 2;
      }
    }
    function z(j, u) {
      let r = e - 1;
      let k = j === true ? 0 : 1;
      const v = x[x.length - 1] === void 0 ? [] : x[x.length - 1];
      const O = u === false && t.stack[e] === "array" && j === true && w !== "[";
      if (A[A.length - 1] === false || t.stack[e] === "array" && l4.script.arrayFormat === "inline" || t.stack[e] === "object" && l4.script.objectIndent === "inline") {
        return;
      }
      A[A.length - 1] = false;
      do {
        if (t.types[r] === "end") {
          k = k + 1;
        } else if (t.types[r] === "start") {
          k = k - 1;
        }
        if (t.stack[r] === "global")
          break;
        if (k === 0) {
          if (t.stack[e] === "class" || t.stack[e] === "map" || O === false && (j === false && t.token[r] !== "(" && t.token[r] !== "x(" || j === true && t.token[r] === ",")) {
            if (t.types[r + 1] === "template_start") {
              if (t.lines[r] < 1) {
                f[r] = -20;
              } else {
                f[r] = y - 1;
              }
            } else if (v.length > 0 && v[v.length - 1] > -1) {
              f[r] = y - 1;
            } else {
              f[r] = y;
            }
          } else if (t.stack[e] === "array" && t.types[e] === "operator") {
            if (t.token[r] === ",")
              f[r] = y;
            if (r === t.begin[e])
              break;
          }
          if (j === false)
            break;
        }
        if (k < 0) {
          if (t.types[r + 1] === "template_start" || t.types[r + 1] === "template_string_start") {
            if (t.lines[r] < 1) {
              f[r] = -20;
            } else {
              f[r] = y - 1;
            }
          } else if (v.length > 0 && v[v.length - 1] > -1) {
            f[r] = y - 1;
          } else {
            f[r] = y;
          }
          break;
        }
        r = r - 1;
      } while (r > -1);
    }
    function G() {
      const j = x[x.length - 1] === void 0 ? [] : x[x.length - 1];
      const u = () => {
        let r = e;
        let k = false;
        const v = t.begin[r];
        do {
          r = r - 1;
          if (t.lexer[r] === "markup") {
            k = true;
            break;
          }
          if (t.begin[r] !== v)
            r = t.begin[r];
        } while (r > v);
        if (k === true) {
          r = e;
          do {
            r = r - 1;
            if (t.begin[r] !== v) {
              r = t.begin[r];
            } else if (t.token[r] === ",") {
              f[r] = y + 1;
            }
          } while (r > v);
          f[v] = y + 1;
          f[e - 1] = y;
        } else {
          f[e - 1] = -20;
        }
      };
      if (w === ")" && t.token[e + 1] === "." && j[j.length - 1] > -1 && t.token[j[0]] !== ":") {
        let r = t.begin[e];
        let k = false;
        let v = false;
        do {
          r = r - 1;
        } while (r > 0 && f[r] < -9);
        k = f[r] === y;
        r = e + 1;
        do {
          r = r + 1;
          if (t.token[r] === "{") {
            v = true;
            break;
          }
          if (t.begin[r] === t.begin[e + 1] && (t.types[r] === "separator" || t.types[r] === "end")) {
            break;
          }
        } while (r < S);
        if (k === false && v === true && x.length > 1) {
          x[x.length - 2].push(t.begin[e]);
          y = y + 1;
        }
      }
      if (p !== "separator")
        Q();
      if (t.token[e + 1] === "," && (t.stack[e] === "object" || t.stack[e] === "array")) {
        z(true, false);
      }
      if (t.token[t.begin[e] - 1] === "," && (t.token[e + 1] === "}" || t.token[e + 1] === "]") && (t.stack[e] === "object" || t.stack[e] === "array")) {
        z(true, false);
      }
      if (t.stack[e] !== "attribute") {
        if (w !== ")" && w !== "x)" && (t.lexer[e - 1] !== "markup" || t.lexer[e - 1] === "markup" && t.token[e - 2] !== "return")) {
          y = y - 1;
        }
        if (w === "}" && t.stack[e] === "switch" && l4.script.noCaseIndent === false) {
          y = y - 1;
        }
      }
      if (w === "}" || w === "x}") {
        if (t.types[e - 1] !== "comment" && P !== "{" && P !== "x{" && p !== "end" && p !== "string" && p !== "number" && p !== "separator" && P !== "++" && P !== "--" && (e < 2 || t.token[e - 2] !== ";" || t.token[e - 2] !== "x;" || P === "break" || P === "return")) {
          let r = e - 1;
          let k = false;
          const v = t.begin[e];
          const O = V.length;
          do {
            if (t.begin[r] === v) {
              if (t.token[r] === "=" || t.token[r] === ";" || t.token[r] === "x;") {
                k = true;
              }
              if (t.token[r] === "." && f[r - 1] > -1) {
                A[A.length - 1] = false;
                f[v] = y + 1;
                f[e - 1] = y;
                break;
              }
              if (r > 0 && t.token[r] === "return" && (t.token[r - 1] === ")" || t.token[r - 1] === "x)" || t.token[r - 1] === "{" || t.token[r - 1] === "x{" || t.token[r - 1] === "}" || t.token[r - 1] === "x}" || t.token[r - 1] === ";" || t.token[r - 1] === "x;")) {
                y = y - 1;
                f[e - 1] = y;
                break;
              }
              if (t.token[r] === ":" && g.length === 0 || t.token[r] === "," && k === false) {
                break;
              }
              if (r === 0 || t.token[r - 1] === "{" || t.token[r - 1] === "x{" || t.token[r] === "for" || t.token[r] === "if" || t.token[r] === "do" || t.token[r] === "function" || t.token[r] === "while" || t.token[r] === "var" || t.token[r] === "let" || t.token[r] === "const" || t.token[r] === "with") {
                if (V[O - 1] === false && O > 1 && (e === S - 1 || t.token[e + 1] !== ")" && t.token[e + 1] !== "x)") && t.stack[e] !== "object") {
                  y = y - 1;
                }
                break;
              }
            } else {
              r = t.begin[r];
            }
            r = r - 1;
          } while (r > v);
        }
        U.pop();
      }
      if (l4.script.bracePadding === false && w !== "}" && p !== "markup") {
        f[e - 1] = -20;
      }
      if (l4.script.bracePadding === true && p !== "start" && P !== ";" && (f[t.begin[e]] < -9 || A[A.length - 1] === true)) {
        f[t.begin[e]] = -10;
        f[e - 1] = -10;
        f.push(-20);
      } else if (t.stack[e] === "attribute") {
        f[e - 1] = -20;
        f.push(y);
      } else if (t.stack[e] === "array" && (j.length > 0 || m[m.length - 1] === true)) {
        Z();
        A[A.length - 1] = false;
        f[t.begin[e]] = y + 1;
        f[e - 1] = y;
        f.push(-20);
      } else if ((t.stack[e] === "object" || t.begin[e] === 0 && w === "}") && j.length > 0) {
        Z();
        A[A.length - 1] = false;
        f[t.begin[e]] = y + 1;
        f[e - 1] = y;
        f.push(-20);
      } else if (w === ")" || w === "x)") {
        const r = w === ")" && P !== "(" && R.length > 0 ? R.pop() + 1 : 0;
        const k = t.token[t.begin[e] - 1] === "if" ? (() => {
          let v = e;
          do {
            v = v - 1;
            if (t.token[v] === ")" && f[v - 1] > -1)
              return r;
          } while (v > t.begin[e]);
          return r + 5;
        })() : r;
        if (r > 0 && (l4.language !== "jsx" || l4.language === "jsx" && t.token[t.begin[e] - 1] !== "render")) {
          const v = l4.wrap;
          const O = t.begin[e];
          const M = R.length;
          let L = e - 2;
          if (k > v) {
            f[t.begin[e]] = y + 1;
            f[e - 1] = y;
            do {
              if (t.begin[L] === O) {
                if (t.token[L] === "&&" || t.token[L] === "||") {
                  f[L] = y + 1;
                } else if (f[L] > -1 && t.types[L] !== "comment" && t.token[L + 1] !== ".") {
                  f[L] = f[L] + 1;
                }
              } else if (f[L] > -1 && t.token[L + 1] !== ".") {
                f[L] = f[L] + 1;
              }
              L = L - 1;
            } while (L > O);
          } else if (M > 0) {
            R[M - 1] = R[M - 1] + r;
          }
        } else if (w === ")" && e > t.begin[e] + 2 && t.lexer[t.begin[e] + 1] === _ && t.token[t.begin[e] + 1] !== "function") {
          const v = t.begin[e] < 0 ? 0 : t.begin[e];
          const O = l4.wrap;
          const M = j.length;
          let L = 0;
          let W = 0;
          let ie = 0;
          let D = 0;
          let Y = 0;
          let se = false;
          let re = false;
          let J = y + 1;
          let K = false;
          let ue = false;
          let be = false;
          if (f[v] < -9) {
            W = v;
            do {
              W = W + 1;
            } while (W < e && f[W] < -9);
            D = W;
            do {
              L = L + t.token[W].length;
              if (f[W] === -10)
                L = L + 1;
              if (t.token[W] === "(" && ie > 0 && ie < O - 1 && D === e) {
                ie = -1;
              }
              if (t.token[W] === ")") {
                Y = Y - 1;
              } else if (t.token[W] === "(") {
                Y = Y + 1;
              }
              if (W === v && Y > 0)
                ie = L;
              W = W - 1;
            } while (W > v && f[W] < -9);
            if (t.token[W + 1] === ".")
              J = f[W] + 1;
            if (L > O - 1 && O > 0 && P !== "(" && ie !== -1 && A[A.length - 2] === false) {
              if (t.token[v - 1] === "if" && V[V.length - 1] === true || t.token[v - 1] !== "if") {
                f[v] = J;
                if (t.token[v - 1] === "for") {
                  W = v;
                  do {
                    W = W + 1;
                    if (t.token[W] === ";" && t.begin[W] === v) {
                      f[W] = J;
                    }
                  } while (W < e);
                }
              }
            }
          }
          W = e;
          L = 0;
          do {
            W = W - 1;
            if (t.stack[W] === "function") {
              W = t.begin[W];
            } else if (t.begin[W] === v) {
              if (t.token[W] === "?") {
                be = true;
              } else if (t.token[W] === "," && se === false) {
                se = true;
                if (L >= O && O > 0)
                  K = true;
              } else if (t.types[W] === "markup" && ue === false) {
                ue = true;
              }
              if (f[W] > -9 && t.token[W] !== "," && t.types[W] !== "markup") {
                L = 0;
              } else {
                if (f[W] === -10)
                  L = L + 1;
                L = L + t.token[W].length;
                if (L >= O && O > 0 && (se === true || ue === true)) {
                  K = true;
                }
              }
            } else {
              if (f[W] > -9) {
                L = 0;
              } else {
                L = L + t.token[W].length;
                if (L >= O && O > 0 && (se === true || ue === true)) {
                  K = true;
                }
              }
            }
          } while (W > v && K === false);
          if (se === false && t.token[t.begin[e] + 1].charAt(0) === "`") {
            f[t.begin[e]] = -20;
            f[e - 1] = -20;
          } else if ((se === true || ue === true) && L >= O && O > 0 || f[v] > -9) {
            if (be === true) {
              J = f[v];
              if (t.token[v - 1] === "[") {
                W = e;
                do {
                  W = W + 1;
                  if (t.types[W] === "end" || t.token[W] === "," || t.token[W] === ";") {
                    break;
                  }
                } while (W < S);
                if (t.token[W] === "]") {
                  J = J - 1;
                  re = true;
                }
              }
            } else if (M > 0 && j[M - 1] > W) {
              J = J - M;
            }
            A[A.length - 1] = false;
            W = e;
            do {
              W = W - 1;
              if (t.begin[W] === v) {
                if (t.token[W].indexOf("=") > -1 && t.types[W] === "operator" && t.token[W].indexOf("!") < 0 && t.token[W].indexOf("==") < 0 && t.token[W] !== "<=" && t.token[W].indexOf(">") < 0) {
                  L = W;
                  do {
                    L = L - 1;
                    if (t.begin[L] === v && (t.token[L] === ";" || t.token[L] === "," || L === v)) {
                      break;
                    }
                  } while (L > v);
                } else if (t.token[W] === ",") {
                  f[W] = J;
                } else if (f[W] > -9 && re === false && (t.token[v - 1] !== "for" || t.token[W + 1] === "?" || t.token[W + 1] === ":") && (t.token[t.begin[e]] !== "(" || t.token[W] !== "+")) {
                  f[W] = f[W] + 1;
                }
              } else if (f[W] > -9 && re === false) {
                f[W] = f[W] + 1;
              }
            } while (W > v);
            f[v] = J;
            f[e - 1] = J - 1;
          } else {
            f[e - 1] = -20;
          }
          if (t.token[t.begin[e] - 1] === "+" && f[t.begin[e]] > -9) {
            f[t.begin[e] - 1] = -10;
          }
        } else if (l4.language === "jsx") {
          u();
        } else {
          f[e - 1] = -20;
        }
        f.push(-20);
      } else if (A[A.length - 1] === true) {
        if (w === "]" && t.begin[e] - 1 > 0 && t.token[t.begin[t.begin[e] - 1]] === "[") {
          A[A.length - 2] = false;
        }
        if (t.begin[e] < f.length)
          f[t.begin[e]] = -20;
        if (l4.language === "jsx") {
          u();
        } else if (w === "]" && f[t.begin[e]] > -1) {
          f[e - 1] = f[t.begin[e]] - 1;
        } else {
          f[e - 1] = -20;
        }
        f.push(-20);
      } else if (t.types[e - 1] === "comment" && t.token[e - 1].substring(0, 2) === "//") {
        if (t.token[e - 2] === "x}")
          f[e - 3] = y + 1;
        f[e - 1] = y;
        f.push(-20);
      } else if (t.types[e - 1] !== "comment" && (P === "{" && w === "}" || P === "[" && w === "]")) {
        f[e - 1] = -20;
        f.push(-20);
      } else if (w === "]") {
        if (V[V.length - 1] === true && A[A.length - 1] === false && l4.script.arrayFormat !== "inline" || P === "]" && f[e - 2] === y + 1) {
          f[e - 1] = y;
          f[t.begin[e]] = y + 1;
        } else if (f[e - 1] === -10) {
          f[e - 1] = -20;
        }
        if (t.token[t.begin[e] + 1] === "function") {
          f[e - 1] = y;
        } else if (V[V.length - 1] === false) {
          if (P === "}" || P === "x}")
            f[e - 1] = y;
          let r = e - 1;
          let k = 1;
          do {
            if (t.token[r] === "]")
              k = k + 1;
            if (t.token[r] === "[") {
              k = k - 1;
              if (k === 0) {
                if (r > 0 && (t.token[r + 1] === "{" || t.token[r + 1] === "x{" || t.token[r + 1] === "[")) {
                  f[r] = y + 1;
                  break;
                }
                if (t.token[r + 1] !== "[" || i === false) {
                  f[r] = -20;
                  break;
                }
                break;
              }
            }
            if (k === 1 && t.token[r] === "+" && f[r] > 1) {
              f[r] = f[r] - 1;
            }
            r = r - 1;
          } while (r > -1);
        } else if (l4.language === "jsx") {
          u();
        }
        if (l4.script.arrayFormat === "inline") {
          let r = e;
          const k = t.begin[e];
          do {
            r = r - 1;
            if (t.types[r] === "end")
              break;
          } while (r > k);
          if (r > k) {
            f[t.begin[e]] = y + 1;
            f[e - 1] = y;
          } else {
            f[t.begin[e]] = -20;
            f[e - 1] = -20;
          }
        } else if (f[t.begin[e]] > -1) {
          f[e - 1] = f[t.begin[e]] - 1;
        }
        f.push(-20);
      } else if (w === "}" || w === "x}" || V[V.length - 1] === true) {
        if (w === "}" && P === "x}" && t.token[e + 1] === "else") {
          f[e - 2] = y + 2;
          f.push(-20);
        } else {
          f.push(y);
        }
        f[e - 1] = y;
      } else {
        f.push(-20);
      }
      if (t.types[e - 1] === "comment")
        f[e - 1] = y;
      if (l4.script.inlineReturn && l4.script.correct === false && w === "x}" && (t.stack[e] === "if" || t.stack[e] === "else") && t.token[t.begin[t.begin[e - 1] - 1] - 2] !== "else") {
        f[e - 1] = -20;
      }
      Z();
      i = V[V.length - 1];
      V.pop();
      x.pop();
      m.pop();
      E.pop();
      q.pop();
      A.pop();
      $.pop();
    }
    function Z() {
      let j = 0;
      const u = x[x.length - 1];
      if (u === void 0)
        return;
      j = u.length - 1;
      if (j < 1 && u[j] < 0 && (w === ";" || w === "x;" || w === ")" || w === "x)" || w === "}" || w === "x}")) {
        u.pop();
        return;
      }
      if (j < 0 || u[j] < 0)
        return;
      if (w === ":") {
        if (t.token[u[j]] !== "?") {
          do {
            u.pop();
            j = j - 1;
            y = y - 1;
          } while (j > -1 && u[j] > -1 && t.token[u[j]] !== "?");
        }
        u[j] = e;
        f[e - 1] = y;
      } else {
        do {
          u.pop();
          j = j - 1;
          y = y - 1;
        } while (j > -1 && u[j] > -1);
      }
      if ((t.stack[e] === "array" || w === ",") && u.length < 1)
        u.push(-1);
    }
    function te() {
      const j = e;
      do {
        if (t.lexer[e + 1] === _ && t.begin[e + 1] < j)
          break;
        if (t.token[j - 1] === "return" && t.types[e] === "end" && t.begin[e] === j)
          break;
        f.push(0);
        e = e + 1;
      } while (e < S);
      o[j] = e;
      f.push(y - 1);
    }
    function Q() {
      let j = e - 1;
      const u = t.begin[e];
      if (y < 1)
        return;
      do {
        if (u !== t.begin[j]) {
          j = t.begin[j];
        } else {
          if (t.types[j] === "separator" || t.types[j] === "operator") {
            if (t.token[j] === "." && f[j - 1] > 0) {
              if (t.token[u - 1] === "if") {
                y = y - 2;
              } else {
                y = y - 1;
              }
            }
            break;
          }
        }
        j = j - 1;
      } while (j > 0 && j > u);
    }
    function ne() {
      if (t.token[e + 1] !== "," && w.indexOf("/>") !== w.length - 2 || t.token[e + 1] === "," && t.token[t.begin[e] - 3] !== "React") {
        z(false, false);
      }
      if (P === "return" || P === "?" || P === ":") {
        f[e - 1] = -10;
        f.push(-20);
      } else if (p === "start" || t.token[e - 2] === "return" && t.stack[e - 1] === "method") {
        f.push(y);
      } else {
        f.push(-20);
      }
    }
    function ke() {
      const j = x[x.length - 1] === void 0 ? [] : x[x.length - 1];
      function u() {
        const r = t.token[e + 1];
        let k = 0;
        let v = 0;
        let O = e;
        let M = w === "+" ? y + 2 : y;
        let L = 0;
        if (l4.wrap < 1) {
          f.push(-10);
          return;
        }
        do {
          O = O - 1;
          if (t.token[t.begin[e]] === "(") {
            if (O === t.begin[e]) {
              L = k;
            }
            if (t.token[O] === "," && t.begin[O] === t.begin[e] && V[V.length - 1] === true) {
              break;
            }
          }
          if (k > l4.wrap - 1)
            break;
          if (f[O] > -9)
            break;
          if (t.types[O] === "operator" && t.token[O] !== "=" && t.token[O] !== "+" && t.begin[O] === t.begin[e]) {
            break;
          }
          k = k + t.token[O].length;
          if (O === t.begin[e] && t.token[O] === "[" && k < l4.wrap - 1) {
            break;
          }
          if (t.token[O] === "." && f[O] > -9)
            break;
          if (f[O] === -10)
            k = k + 1;
        } while (O > 0);
        if (L > 0)
          L = L + r.length;
        k = k + r.length;
        v = O;
        if (k > l4.wrap - 1 && f[O] < -9) {
          do {
            v = v - 1;
          } while (v > 0 && f[v] < -9);
        }
        if (t.token[v + 1] === "." && t.begin[e] <= t.begin[v]) {
          M = M + 1;
        } else if (t.types[v] === "operator") {
          M = f[v];
        }
        v = r.length;
        if (k + v < l4.wrap) {
          f.push(-10);
          return;
        }
        if (t.token[t.begin[e]] === "(" && (t.token[j[0]] === ":" || t.token[j[0]] === "?")) {
          M = y + 3;
        } else if (t.stack[e] === "method") {
          f[t.begin[e]] = y;
          if (V[V.length - 1] === true) {
            M = y + 3;
          } else {
            M = y + 1;
          }
        } else if (t.stack[e] === "object" || t.stack[e] === "array") {
          z(true, false);
        }
        if (t.token[O] === "var" || t.token[O] === "let" || t.token[O] === "const") {
          k = k - l4.indentSize * l4.indentChar.length * 2;
        }
        if (L > 0) {
          O = l4.wrap - L;
        } else {
          O = l4.wrap - k;
        }
        if (O > 0 && O < 5) {
          f.push(M);
          if (t.token[e].charAt(0) === '"' || t.token[e].charAt(0) === "'") {
            e = e + 1;
            f.push(-10);
          }
          return;
        }
        if (t.token[t.begin[e]] !== "(" || L > l4.wrap - 1 || L === 0) {
          if (L > 0)
            k = L;
          if (k - r.length < l4.wrap - 1 && (r.charAt(0) === '"' || r.charAt(0) === "'")) {
            e = e + 1;
            k = k + 3;
            if (k - r.length > l4.wrap - 4) {
              f.push(M);
              return;
            }
            f.push(-10);
            return;
          }
          f.push(M);
          return;
        }
        f.push(-10);
      }
      Q();
      if (j.length > 0 && j[j.length - 1] > -1 && t.stack[e] === "array") {
        m[m.length - 1] = true;
      }
      if (w !== ":") {
        if (t.token[t.begin[e]] !== "(" && t.token[t.begin[e]] !== "x(" && A.length > 0) {
          z(true, false);
        }
        if (w !== "?" && t.token[j[j.length - 1]] === ".") {
          let r = 0;
          let k = e;
          const v = t.begin[k];
          do {
            if (t.begin[k] === v) {
              if (t.token[k + 1] === "{" || t.token[k + 1] === "[" || t.token[k] === "function") {
                break;
              }
              if (t.token[k] === "," || t.token[k] === ";" || t.types[k] === "end" || t.token[k] === ":") {
                j.pop();
                y = y - 1;
                break;
              }
              if (t.token[k] === "?" || t.token[k] === ":") {
                if (t.token[j[j.length - 1]] === "." && r < 2)
                  j[j.length - 1] = v + 1;
                break;
              }
              if (t.token[k] === ".")
                r = r + 1;
            }
            k = k + 1;
          } while (k < S);
        }
      }
      if (w === "!" || w === "...") {
        if (P === "}" || P === "x}")
          f[e - 1] = y;
        f.push(-20);
        return;
      }
      if (P === ";" || P === "x;") {
        if (t.token[t.begin[e] - 1] !== "for")
          f[e - 1] = y;
        f.push(-20);
        return;
      }
      if (w === "*") {
        if (P === "function" || P === "yield") {
          f[e - 1] = -20;
        } else {
          f[e - 1] = -10;
        }
        f.push(-10);
        return;
      }
      if (w === "?") {
        if (t.lines[e] === 0 && t.types[e - 2] === "word" && t.token[e - 2] !== "return" && t.token[e - 2] !== "in" && t.token[e - 2] !== "instanceof" && t.token[e - 2] !== "typeof" && (p === "reference" || p === "word")) {
          if (t.types[e + 1] === "word" || t.types[e + 1] === "reference" || (t.token[e + 1] === "(" || t.token[e + 1] === "x(") && t.token[e - 2] === "new") {
            f[e - 1] = -20;
            if (t.types[e + 1] === "word" || t.types[e + 1] === "reference") {
              f.push(-10);
              return;
            }
            f.push(-20);
            return;
          }
        }
        if (t.token[e + 1] === ":") {
          f[e - 1] = -20;
          f.push(-20);
          return;
        }
        g.push(e);
        if (l4.script.ternaryLine === true) {
          f[e - 1] = -10;
        } else {
          let r = e - 1;
          do {
            r = r - 1;
          } while (r > -1 && f[r] < -9);
          j.push(e);
          y = y + 1;
          if (f[r] === y && t.token[r + 1] !== ":") {
            y = y + 1;
            j.push(e);
          }
          f[e - 1] = y;
          if (t.token[t.begin[e]] === "(" && (j.length < 2 || j[0] === j[1])) {
            A[A.length - 1] = false;
            if (e - 2 === t.begin[e]) {
              f[t.begin[e]] = y - 1;
            } else {
              f[t.begin[e]] = y;
            }
            r = e - 2;
            do {
              if (t.types[r] === "end" && f[r - 1] > -1)
                break;
              if (f[r] > -1)
                f[r] = f[r] + 1;
              r = r - 1;
            } while (r > t.begin[e]);
          }
        }
        f.push(-10);
        return;
      }
      if (w === ":") {
        if (t.stack[e] === "map" || t.types[e + 1] === "type" || t.types[e + 1] === "type_start") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (g.length > 0 && t.begin[g[g.length - 1]] === t.begin[e]) {
          let r = e;
          const k = t.begin[e];
          do {
            r = r - 1;
            if (t.begin[r] === k) {
              if (t.token[r] === "," || t.token[r] === ";") {
                f[e - 1] = -20;
                break;
              }
              if (t.token[r] === "?") {
                g.pop();
                Z();
                if (l4.script.ternaryLine === true)
                  f[e - 1] = -10;
                f.push(-10);
                return;
              }
            } else if (t.types[r] === "end") {
              r = t.begin[r];
            }
          } while (r > k);
        }
        if (t.token[e - 2] === "where" && t.stack[e - 2] === t.stack[e]) {
          f[e - 1] = -10;
          f.push(-10);
          return;
        }
        if (p === "reference" && t.token[t.begin[e]] !== "(" && t.token[t.begin[e]] !== "x(") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if ((P === ")" || P === "x)") && t.token[t.begin[e - 1] - 2] === "function") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (t.stack[e] === "attribute") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (t.token[t.begin[e]] !== "(" && t.token[t.begin[e]] !== "x(" && (p === "reference" || P === ")" || P === "]" || P === "?") && (t.stack[e] === "map" || t.stack[e] === "class" || t.types[e + 1] === "reference") && (g.length === 0 || g[g.length - 1] < t.begin[e]) && ("mapclassexpressionmethodglobalparen".indexOf(t.stack[e]) > -1 || t.types[e - 2] === "word" && t.stack[e] !== "switch")) {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (t.stack[e] === "switch" && (g.length < 1 || g[g.length - 1] < t.begin[e])) {
          f[e - 1] = -20;
          if (l4.script.caseSpace === true) {
            f.push(-10);
          } else {
            f.push(y);
          }
          return;
        }
        if (t.stack[e] === "object") {
          f[e - 1] = -20;
        } else if (g.length > 0) {
          f[e - 1] = y;
        } else {
          f[e - 1] = -10;
        }
        f.push(-10);
        return;
      }
      if (w === "++" || w === "--") {
        if (p === "number" || p === "reference") {
          f[e - 1] = -20;
          f.push(-10);
        } else if (e < S - 1 && (t.types[e + 1] === "number" || t.types[e + 1] === "reference")) {
          f.push(-20);
        } else {
          f.push(-10);
        }
        return;
      }
      if (w === "+") {
        if (p === "start") {
          f[e - 1] = -20;
        } else {
          f[e - 1] = -10;
        }
        if (l4.wrap < 1 || t.token[t.begin[e]] === "x(") {
          f.push(-10);
          return;
        }
        const r = t.token[e + 1];
        if (r === void 0) {
          f.push(-10);
          return;
        }
        if (t.types[e - 1] === "operator" || t.types[e - 1] === "start") {
          if (t.types[e + 1] === "reference" || r === "(" || r === "[") {
            f.push(-20);
            return;
          }
          if (Number(r.slice(1, -1)) > -1 && (/\d/.test(r.charAt(1)) === true || r.charAt(1) === "." || r.charAt(1) === "-" || r.charAt(1) === "+")) {
            f.push(-20);
            return;
          }
        }
        return u();
      }
      if (t.types[e - 1] !== "comment") {
        if (P === "(") {
          f[e - 1] = -20;
        } else if (w === "*" && t.stack[e] === "object" && t.types[e + 1] === "reference" && (P === "{" || P === ",")) {
          f[e - 1] = y;
        } else if (w !== "?" || g.length === 0) {
          f[e - 1] = -10;
        }
      }
      if (w.indexOf("=") > -1 && w !== "==" && w !== "===" && w !== "!=" && w !== "!==" && w !== ">=" && w !== "<=" && w !== "=>" && t.stack[e] !== "method" && t.stack[e] !== "object") {
        let r = e + 1;
        let k = 0;
        let v = false;
        let O = "";
        if ((t.token[t.begin[e]] === "(" || t.token[t.begin[e]] === "x(") && t.token[e + 1] !== "function") {
          return;
        }
        do {
          if (t.types[r] === "start") {
            if (v === true && t.token[r] !== "[") {
              if ($[$.length - 1] === true) {
                $[$.length - 1] = false;
              }
              break;
            }
            k = k + 1;
          }
          if (t.types[r] === "end")
            k = k - 1;
          if (k < 0) {
            if ($[$.length - 1] === true) {
              $[$.length - 1] = false;
            }
            break;
          }
          if (k === 0) {
            O = t.token[r];
            if (v === true) {
              if (t.types[r] === "operator" || t.token[r] === ";" || t.token[r] === "x;" || t.token[r] === "?" || t.token[r] === "var" || t.token[r] === "let" || t.token[r] === "const") {
                if (O !== void 0 && (O === "?" || O.indexOf("=") > -1 && O !== "==" && O !== "===" && O !== "!=" && O !== "!==" && O !== ">=" && O !== "<=")) {
                  if ($[$.length - 1] === false) {
                    $[$.length - 1] = true;
                  }
                }
                if ((O === ";" || O === "x;" || O === "var" || O === "let" || O === "const") && $[$.length - 1] === true) {
                  $[$.length - 1] = false;
                }
                break;
              }
              if ($[$.length - 1] === true && (O === "return" || O === "break" || O === "continue" || O === "throw")) {
                $[$.length - 1] = false;
              }
            }
            if (O === ";" || O === "x;" || O === ",")
              v = true;
          }
          r = r + 1;
        } while (r < S);
        f.push(-10);
        return;
      }
      if (w === "-" && P === "return" || P === "=") {
        f.push(-20);
        return;
      }
      if (p === "operator" && t.types[e + 1] === "reference" && P !== "--" && P !== "++" && w !== "&&" && w !== "||") {
        f.push(-20);
        return;
      }
      return u();
    }
    function B() {
      const j = () => {
        let u = t.begin[e];
        if (u < 0) {
          I.push([t.token[e], -1]);
        } else {
          if (t.stack[u + 1] !== "function") {
            do {
              u = t.begin[u];
            } while (u > -1 && t.stack[u + 1] !== "function");
          }
          I.push([t.token[e], u]);
        }
      };
      if (t.types[e - 1] === "comment") {
        f[e - 1] = y;
      } else if (p === "end" && P !== ")" && t.token[t.begin[e - 1] - 1] !== ")") {
        f[e - 1] = -10;
      } else if (p !== "separator" && p !== "start" && p !== "end" && p.indexOf("template_string") < 0) {
        if (p === "word" || p === "operator" || p === "property" || p === "type" || p === "reference") {
          f[e - 1] = -10;
        } else {
          f[e - 1] = -20;
        }
      }
      if (P === "var" && t.lexer[e - 1] === _) {
        j();
      } else if (P === "function") {
        I.push([t.token[e], e]);
      } else if (P === "let" || P === "const") {
        I.push([t.token[e], e]);
      } else if (t.stack[e] === "arguments") {
        I.push([t.token[e], e]);
      } else if (P === ",") {
        let u = e;
        do {
          u = u - 1;
        } while (u > t.begin[e] && t.token[u] !== "var" && t.token[u] !== "let" && t.token[u] !== "const");
        if (t.token[u] === "var") {
          j();
        } else if (t.token[u] === "let" || t.token[u] === "const") {
          I.push([t.token[e], e]);
        }
      }
      f.push(-10);
    }
    function H() {
      const j = x[x.length - 1] === void 0 ? [] : x[x.length - 1];
      const u = () => {
        if (l4.script.methodChain > 0) {
          let r = e;
          let k = t.begin[e];
          const v = [e];
          const O = t.token[k - 1] === "if";
          do {
            r = r - 1;
            if (t.types[r] === "end")
              r = t.begin[r];
            if (t.begin[r] === k) {
              if (t.types[r] === "string" && t.token[r].indexOf("${") === t.token[r].length - 2) {
                break;
              }
              if (t.token[r] === ".") {
                if (f[r - 1] > 0) {
                  f[e - 1] = O === true ? y + 1 : y;
                  return;
                }
                v.push(r);
              } else if (t.token[r] === ";" || t.token[r] === "," || t.types[r] === "operator" || (t.types[r] === "word" || t.types[r] === "reference") && (t.types[r - 1] === "word" || t.types[r - 1] === "reference")) {
                break;
              }
            }
          } while (r > k);
          if (v.length < l4.script.methodChain) {
            f[e - 1] = -20;
            return;
          }
          r = 0;
          k = v.length;
          do {
            f[v[r] - 1] = O === true ? y + 1 : y;
            r = r + 1;
          } while (r < k);
          r = v[v.length - 1] - 1;
          do {
            if (f[r] > -1)
              f[r] = f[r] + 1;
            r = r + 1;
          } while (r < e);
          y = O === true ? y + 2 : y + 1;
        }
        f[e - 1] = y;
      };
      if (w === "::") {
        f[e - 1] = -20;
        f.push(-20);
        return;
      }
      if (w === ".") {
        if (t.token[t.begin[e]] !== "(" && t.token[t.begin[e]] !== "x(" && j.length > 0) {
          if (t.stack[e] === "object" || t.stack[e] === "array") {
            z(true, false);
          } else {
            z(false, false);
          }
        }
        if (l4.script.methodChain === 0) {
          f[e - 1] = -20;
        } else if (l4.script.methodChain < 0) {
          if (t.lines[e] > 0) {
            u();
          } else {
            f[e - 1] = -20;
          }
        } else {
          u();
        }
        f.push(-20);
        return;
      }
      if (w === ",") {
        Q();
        if (V[V.length - 1] === false && (t.stack[e] === "object" || t.stack[e] === "array" || t.stack[e] === "paren" || t.stack[e] === "expression" || t.stack[e] === "method")) {
          V[V.length - 1] = true;
          if (t.token[t.begin[e]] === "(") {
            let r = e;
            do {
              r = r - 1;
              if (t.begin[r] === t.begin[e] && t.token[r] === "+" && f[r] > -9) {
                f[r] = f[r] + 2;
              }
            } while (r > t.begin[e]);
          }
        }
        if (t.stack[e] === "array" && l4.script.arrayFormat === "indent") {
          f[e - 1] = -20;
          f.push(y);
          return;
        }
        if (t.stack[e] === "array" && l4.script.arrayFormat === "inline") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (t.stack[e] === "object" && l4.script.objectIndent === "indent") {
          f[e - 1] = -20;
          f.push(y);
          return;
        }
        if (t.stack[e] === "object" && l4.script.objectIndent === "inline") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        if (j.length > 0) {
          if (j[j.length - 1] > -1)
            Z();
          f[e - 1] = -20;
          f.push(y);
          return;
        }
        if (t.token[e - 2] === ":" && t.token[e - 4] === "where") {
          f[e - 1] = -20;
          f.push(-10);
          return;
        }
        f[e - 1] = -20;
        if (t.types[e + 1] !== "end") {
          E[E.length - 1] = E[E.length - 1] + 1;
        }
        if ((t.token[t.begin[e]] === "(" || t.token[t.begin[e]] === "x(") && l4.language !== "jsx" && t.stack[e] !== "global" && (t.types[e - 1] !== "string" && t.types[e - 1] !== "number" || t.token[e - 2] !== "+" || t.types[e - 1] === "string" && t.types[e - 1] !== "number" && t.token[e - 2] === "+" && t.types[e - 3] !== "string" && t.types[e - 3] !== "number")) {
          f.push(-10);
          return;
        }
        if (p === "reference" && t.types[e - 2] === "word" && "var-let-const-from".indexOf(t.token[e - 2]) < 0 && (t.types[e - 3] === "end" || t.token[e - 3] === ";")) {
          q[q.length - 1] = true;
          f.push(-10);
          return;
        }
        if (q[q.length - 1] === true || t.stack[e] === "notation") {
          f.push(-10);
          return;
        }
        if (E[E.length - 1] > 3 && (t.stack[e] === "array" || t.stack[e] === "object")) {
          if (A[A.length - 1] === true)
            z(true, true);
          f[e - 1] = -20;
          if (m[m.length - 1] === true) {
            f.push(y);
            return;
          }
          const r = t.begin[e];
          let k = e;
          do {
            if (t.types[k] === "end") {
              k = t.begin[k];
            } else {
              if (t.token[k] === "," && t.types[k + 1] !== "comment") {
                f[k] = y;
              }
            }
            k = k - 1;
          } while (k > r);
          f[r] = y;
          m[m.length - 1] = true;
          return;
        }
        if (t.stack[e] === "object") {
          if (A[A.length - 1] === true && t.types[t.begin[e] - 1] !== "word" && t.types[t.begin[e] - 1] !== "reference" && t.token[t.begin[e] - 1] !== "(" && t.token[t.begin[e] - 1] !== "x(") {
            const r = t.begin[e];
            let k = e - 1;
            do {
              if (t.begin[k] === r) {
                if (t.token[k] === ",")
                  break;
                if (t.token[k] === ":") {
                  z(true, false);
                  break;
                }
              }
              k = k - 1;
            } while (k > r);
          }
        }
        if (A[A.length - 1] === false || t.token[e - 2] === "+" && (p === "string" || p === "number") && f[e - 2] > 0 && (P.charAt(0) === '"' || P.charAt(0) === "'")) {
          if (t.stack[e] === "method") {
            if (t.token[e - 2] === "+" && (P.charAt(0) === '"' || P.charAt(0) === "'") && (t.token[e - 3].charAt(0) === '"' || t.token[e - 3].charAt(0) === "'")) {
              f.push(y + 2);
              return;
            }
            if (t.token[e - 2] !== "+") {
              f.push(-10);
              return;
            }
          }
          f.push(y);
          return;
        }
        if (A[A.length - 1] === true && t.stack[e] !== "object") {
          f.push(-10);
          return;
        }
        if (E[E.length - 1] < 4 && (t.stack[e] === "array" || t.stack[e] === "object")) {
          f.push(-10);
          return;
        }
        f.push(y);
        return;
      }
      if (w === ";" || w === "x;") {
        Q();
        if (t.token[e + 1] !== void 0 && t.types[e + 1].indexOf("attribute") > 0 && t.types[e + 1].indexOf("end") > 0) {
          f[e - 1] = -20;
          f.push(y - 1);
          return;
        }
        if (U[U.length - 1] > -1 && t.stack[U[U.length - 1]] !== "expression") {
          let r = e;
          do {
            r = r - 1;
            if (t.token[r] === ";")
              break;
            if (t.token[r] === ",") {
              y = y - 1;
              break;
            }
            if (t.types[r] === "end")
              r = t.begin[r];
          } while (r > 0 && r > t.begin[e]);
        }
        U[U.length - 1] = -1;
        Z();
        if (t.token[t.begin[e] - 1] !== "for")
          z(false, false);
        q[q.length - 1] = false;
        f[e - 1] = -20;
        if (t.begin[e] > 0 && t.token[t.begin[e] - 1] === "for" && t.stack[e] !== "for") {
          f.push(-10);
          return;
        }
        f.push(y);
        return;
      }
      f.push(-20);
    }
    function ge() {
      const j = t.stack[e + 1];
      const u = e === 0 ? t.stack[e] : t.stack[e - 1];
      if (P === ")" || (u === "object" || u === "array") && P !== "]") {
        if (j !== "method" || j === "method" && t.token[e + 1] !== ")" && t.token[e + 2] !== ")") {
          if (P === ")" && (j !== "function" || t.token[t.begin[t.begin[e - 1] - 1]] === "(" || t.token[t.begin[t.begin[e - 1] - 1]] === "x(")) {
            z(false, false);
          } else if (t.types[e + 1] !== "end" && t.types[e + 2] !== "end") {
            z(true, false);
          }
        }
      }
      V.push(false);
      x.push([]);
      $.push(false);
      m.push(false);
      q.push(false);
      E.push(0);
      if (l4.script.neverFlatten === true || j === "array" && l4.script.arrayFormat === "indent" || j === "attribute" || p === "generic" || j === "class" && P !== "(" && P !== "x(" || w === "[" && t.token[e + 1] === "function") {
        A.push(false);
      } else {
        if (j === "expression" || j === "method") {
          A.push(true);
        } else if ((j === "object" || j === "class") && (P === "(" || P === "x(" || p === "word" || p === "reference")) {
          A.push(true);
        } else if (j === "array" || w === "(" || w === "x(") {
          A.push(true);
        } else if (w === "{" && j === "object" && p !== "operator" && p !== "start" && p !== "string" && p !== "number" && u !== "object" && u !== "array" && e > 0) {
          A.push(true);
        } else {
          A.push(false);
        }
      }
      if (w !== "(" && w !== "x(" && t.stack[e + 1] !== "attribute") {
        y = y + 1;
      }
      if (w === "{" || w === "x{") {
        U.push(-1);
        if (t.types[e - 1] !== "comment") {
          if (p === "markup") {
            f[e - 1] = y;
          } else if (l4.script.braceAllman === true && p !== "operator" && P !== "return") {
            f[e - 1] = y - 1;
          } else if (t.stack[e + 1] !== "block" && (j === "function" || P === ")" || P === "x)" || P === "," || P === "}" || p === "markup")) {
            f[e - 1] = -10;
          } else if (P === "{" || P === "x{" || P === "[" || P === "}" || P === "x}") {
            f[e - 1] = y - 1;
          }
        }
        if (j === "object") {
          if (l4.script.objectIndent === "indent") {
            A[A.length - 1] = false;
            f.push(y);
            return;
          }
          if (l4.script.objectIndent === "inline") {
            A[A.length - 1] = true;
            f.push(-20);
            return;
          }
        }
        if (j === "switch") {
          if (l4.script.noCaseIndent === true) {
            f.push(y - 1);
            return;
          }
          y = y + 1;
          f.push(y);
          return;
        }
        if (A[A.length - 1] === true) {
          if (p !== "word" && p !== "reference") {
            f.push(-20);
            return;
          }
        }
        f.push(y);
        return;
      }
      if (w === "(" || w === "x(") {
        if (l4.wrap > 0 && w === "(" && t.token[e + 1] !== ")") {
          R.push(1);
        }
        if (P === "-" && (t.token[e - 2] === "(" || t.token[e - 2] === "x(")) {
          f[e - 2] = -20;
        }
        if (p === "end" && u !== "if" && u !== "for" && u !== "catch" && u !== "else" && u !== "do" && u !== "try" && u !== "finally" && u !== "catch") {
          if (t.types[e - 1] === "comment") {
            f[e - 1] = y;
          } else {
            f[e - 1] = -20;
          }
        }
        if (P === "async") {
          f[e - 1] = -10;
        } else if (j === "method" || t.token[e - 2] === "function" && p === "reference") {
          if (P === "import" || P === "in" || l4.script.functionNameSpace === true) {
            f[e - 1] = -10;
          } else if (P === "}" && t.stack[e - 1] === "function" || p === "word" || p === "reference" || p === "property") {
            f[e - 1] = -20;
          } else if (u !== "method" && j !== "method") {
            f[e - 1] = y;
          }
        }
        if (P === "+" && (t.token[e - 2].charAt(0) === '"' || t.token[e - 2].charAt(0) === "'")) {
          f.push(y);
          return;
        }
        if (P === "}" || P === "x}") {
          f.push(-20);
          return;
        }
        if (P === "-" && (e < 2 || t.token[e - 2] !== ")" && t.token[e - 2] !== "x)" && t.token[e - 2] !== "]" && t.types[e - 2] !== "reference" && t.types[e - 2] !== "string" && t.types[e - 2] !== "number") || l4.script.functionSpace === false && P === "function") {
          f[e - 1] = -20;
        }
        f.push(-20);
        return;
      }
      if (w === "[") {
        if (P === "[")
          V[V.length - 2] = true;
        if (P === "return" || P === "var" || P === "let" || P === "const") {
          f[e - 1] = -10;
        } else if (t.types[e - 1] !== "comment" && t.stack[e - 1] !== "attribute" && (p === "end" || p === "word" || p === "reference")) {
          f[e - 1] = -20;
        } else if (P === "[" || P === "{" || P === "x{") {
          f[e - 1] = y - 1;
        }
        if (t.stack[e] === "attribute") {
          f.push(-20);
          return;
        }
        if (l4.script.arrayFormat === "indent") {
          A[A.length - 1] = false;
          f.push(y);
          return;
        }
        if (l4.script.arrayFormat === "inline") {
          A[A.length - 1] = true;
          f.push(-20);
          return;
        }
        if (j === "method" || A[A.length - 1] === true) {
          f.push(-20);
          return;
        }
        let r = e + 1;
        do {
          if (t.token[r] === "]") {
            f.push(-20);
            return;
          }
          if (t.token[r] === ",") {
            f.push(y);
            return;
          }
          r = r + 1;
        } while (r < S);
        f.push(-20);
      }
    }
    function ye() {
      if (w.length === 1) {
        f.push(-20);
        if (t.lines[e] === 0)
          f[e - 1] = -20;
      } else if (w.indexOf("#!/") === 0) {
        f.push(y);
      } else {
        f.push(-10);
      }
      if ((P === "," || p === "start") && (t.stack[e] === "object" || t.stack[e] === "array") && A[A.length - 1] === false && e > 0) {
        f[e - 1] = y;
      }
    }
    function pe() {
      if (N === "template_else") {
        f[e - 1] = y - 1;
        f.push(y);
      } else if (N === "template_start") {
        y = y + 1;
        if (t.lines[e - 1] < 1)
          f[e - 1] = -20;
        if (t.lines[e] > 0 || P.length === 1 && p === "string") {
          f.push(y);
        } else {
          f.push(-20);
        }
      } else if (N === "template_end") {
        y = y - 1;
        if (p === "template_start" || t.lines[e - 1] < 1) {
          f[e - 1] = -20;
        } else {
          f[e - 1] = y;
        }
        if (t.lines[e] > 0) {
          f.push(y);
        } else {
          f.push(-20);
        }
      } else if (N === "template") {
        if (t.lines[e] > 0) {
          f.push(y);
        } else {
          f.push(-20);
        }
      }
    }
    function Se() {
      if (N === "template_string_start") {
        y = y + 1;
        f.push(y);
      } else if (N === "template_string_else") {
        Q();
        f[e - 1] = y - 1;
        f.push(y);
      } else {
        Q();
        y = y - 1;
        f[e - 1] = y;
        f.push(-10);
      }
      if (e > 2 && (t.types[e - 2] === "template_string_else" || t.types[e - 2] === "template_string_start")) {
        if (l4.script.bracePadding === true) {
          f[e - 2] = -10;
          f[e - 1] = -10;
        } else {
          f[e - 2] = -20;
          f[e - 1] = -20;
        }
      }
    }
    function $e() {
      if (t.token[e - 1] === "," || t.token[e - 1] === ":" && t.stack[e - 1] !== "data_type") {
        f[e - 1] = -10;
      } else {
        f[e - 1] = -20;
      }
      if (t.types[e] === "type" || t.types[e] === "type_end") {
        f.push(-10);
      }
      if (t.types[e] === "type_start") {
        f.push(-20);
      }
    }
    function Re() {
      if ((P === ")" || P === "x)") && t.stack[e] === "class" && (t.token[t.begin[e - 1] - 1] === "static" || t.token[t.begin[e - 1] - 1] === "final" || t.token[t.begin[e - 1] - 1] === "void")) {
        f[e - 1] = -10;
        f[t.begin[e - 1] - 1] = -10;
      }
      if (P === "]")
        f[e - 1] = -10;
      if (w === "else" && P === "}") {
        if (t.token[e - 2] === "x}")
          f[e - 3] = f[e - 3] - 1;
        if (l4.script.braceAllman === true || l4.script.elseNewline === true) {
          f[e - 1] = y;
        }
      }
      if (w === "new" && c.has(t.token[e + 1]))
        ;
      if (w === "from" && p === "end" && e > 0 && (t.token[t.begin[e - 1] - 1] === "import" || t.token[t.begin[e - 1] - 1] === ",")) {
        f[e - 1] = -10;
      }
      if (w === "function") {
        if (l4.script.functionSpace === false && e < S - 1 && (t.token[e + 1] === "(" || t.token[e + 1] === "x(")) {
          f.push(-20);
          return;
        }
        f.push(-10);
        return;
      }
      if (P === "-" && e > 1) {
        if (t.types[e - 2] === "operator" || t.token[e - 2] === ",") {
          f[e - 1] = -20;
        } else if (t.types[e - 2] === "start") {
          f[e - 2] = -20;
          f[e - 1] = -20;
        }
      } else if (w === "while" && (P === "}" || P === "x}")) {
        let j = e - 1;
        let u = 0;
        do {
          if (t.token[j] === "}" || t.token[j] === "x}")
            u = u + 1;
          if (t.token[j] === "{" || t.token[j] === "x{")
            u = u - 1;
          if (u === 0) {
            if (t.token[j - 1] === "do") {
              f[e - 1] = -10;
              break;
            }
            f[e - 1] = y;
            break;
          }
          j = j - 1;
        } while (j > -1);
      } else if (w === "in" || (w === "else" && l4.script.elseNewline === false && l4.script.braceAllman === false || w === "catch") && (P === "}" || P === "x}")) {
        f[e - 1] = -10;
      } else if (w === "var" || w === "let" || w === "const") {
        U[U.length - 1] = e;
        if (p === "end")
          f[e - 1] = y;
        if (t.token[t.begin[e] - 1] !== "for") {
          let j = e + 1;
          let u = 0;
          do {
            if (t.types[j] === "end")
              u = u - 1;
            if (t.types[j] === "start")
              u = u + 1;
            if (u < 0 || u === 0 && (t.token[j] === ";" || t.token[j] === ",")) {
              break;
            }
            j = j + 1;
          } while (j < S);
          if (t.token[j] === ",")
            y = y + 1;
        }
        f.push(-10);
        return;
      }
      if ((w === "default" || w === "case") && p !== "word" && t.stack[e] === "switch") {
        f[e - 1] = y - 1;
        f.push(-10);
        return;
      }
      if (w === "catch" && P === ".") {
        f[e - 1] = -20;
        f.push(-20);
        return;
      }
      if (w === "catch" || w === "finally") {
        f[e - 1] = -10;
        f.push(-10);
        return;
      }
      if (l4.script.bracePadding === false && e < S - 1 && t.token[e + 1].charAt(0) === "}") {
        f.push(-20);
        return;
      }
      if (t.stack[e] === "object" && (P === "{" || P === ",") && (t.token[e + 1] === "(" || t.token[e + 1] === "x(")) {
        f.push(-20);
        return;
      }
      if (t.types[e - 1] === "comment" && t.token[t.begin[e]] === "(") {
        f[e - 1] = y + 1;
      }
      if (l4.script.inlineReturn) {
        if (t.stack[e] === "if" && w === "return" && (P === "x{" || P === "{")) {
          const j = t.begin.lastIndexOf(t.begin[e - 1], e - 3);
          if (t.token[j - 2] === "else") {
            if (P === "x{")
              t.token[e - 1] = "{";
            if (t.token[t.ender[e]] === "x}")
              t.token[t.ender[e]] = "}";
            t.lines[t.ender[e]] = t.lines[t.ender[e]] - 1;
          } else {
            if (t.token[t.ender[e - 1] + 2] !== "if" && t.token[t.ender[e - 1] + 1] !== "else") {
              f[e - 1] = -20;
              if (P === "{")
                t.token[e - 1] = "x{";
              if (t.token[t.ender[e]] === "}")
                t.token[t.ender[e]] = "x}";
            } else if (t.token[t.ender[e - 1] + 2] !== "if" && t.token[t.ender[e - 1] + 1] !== "x{") {
              f[e - 1] = -20;
              t.lines[t.ender[e - 1] + 2] = t.lines[t.ender[e - 1] + 2] - 1;
              if (t.token[e - 1] === "{")
                t.token[e - 1] = "x{";
              if (t.token[t.ender[e]] === "}")
                t.token[t.ender[e]] = "x}";
              if (t.token[t.ender[e - 1] + 2] === "{")
                t.token[t.ender[e - 1] + 2] = "x{";
            }
          }
        }
        if ((P === "x}" || P === "}") && (t.stack[e - 1] === "if" && w === "else" && (t.token[e + 1] === "{" || t.token[e + 1] === "x{") && t.token[e + 2] === "return")) {
          if (t.token[e - 2] === "x;")
            t.token[e - 2] = ";";
        }
        if (P === "x{" && w === "return" && t.stack[e] === "else") {
          f[e - 1] = -20;
          if (t.token[t.ender[e - 1] - 1] === "x;")
            t.token[t.ender[e - 1] - 1] = ";";
          t.lines[t.ender[e - 1]] = t.lines[t.ender[e - 1]] - 1;
          t.lines[t.ender[e] + 1] = t.lines[t.ender[e] + 1] - 1;
        }
        if (P === "x}" && w === "else" && t.token[e + 1] === "x{" && t.token[e + 2] === "return" && t.token[t.ender[e] - 1] === "}") {
          t.token[t.ender[e] - 1] = "x}";
        }
      }
      f.push(-10);
    }
    do {
      if (t.lexer[e] === _) {
        N = t.types[e];
        w = t.token[e];
        if (N === "comment") {
          ee();
        } else if (N === "regex") {
          f.push(-20);
        } else if (N === "string") {
          ye();
        } else if (N.indexOf("template_string") === 0) {
          Se();
        } else if (N === "separator") {
          H();
        } else if (N === "start") {
          ge();
        } else if (N === "end") {
          G();
        } else if (N === "type" || N === "type_start" || N === "type_end") {
          $e();
        } else if (N === "operator") {
          ke();
        } else if (N === "word") {
          Re();
        } else if (N === "reference") {
          B();
        } else if (N === "markup") {
          ne();
        } else if (N.indexOf("template") === 0) {
          pe();
        } else if (N === "generic") {
          if (P !== "return" && P.charAt(0) !== "#" && p !== "operator" && P !== "public" && P !== "private" && P !== "static" && P !== "final" && P !== "implements" && P !== "class" && P !== "void") {
            f[e - 1] = -20;
          }
          if (t.token[e + 1] === "(" || t.token[e + 1] === "x(") {
            f.push(-20);
          } else {
            f.push(-10);
          }
        } else {
          f.push(-10);
        }
        if (N !== "comment") {
          p = N;
          P = w;
        }
        if (R.length > 0 && t.token[e] !== ")") {
          if (t.types[e] === "comment" && R[R.length - 1] > -1) {
            R[R.length - 1] = l4.wrap + 1;
          } else if (f[e] > -1 || t.token[e].charAt(0) === "`" && t.token[e].indexOf("\n") > 0) {
            R[R.length - 1] = -1;
          } else if (R[R.length - 1] > -1) {
            R[R.length - 1] = R[R.length - 1] + t.token[e].length;
            if (f[e] === -10)
              R[R.length - 1] = R[R.length - 1] + 1;
          }
        }
      } else {
        te();
      }
      e = e + 1;
    } while (e < S);
    return f;
  })();
  const a = (() => {
    const e = [];
    const y = (() => {
      const f = [];
      const g = l4.indentChar;
      let x = l4.indentSize;
      if (typeof x !== "number" || x < 1)
        return "";
      do {
        f.push(g);
        x = x - 1;
      } while (x > 0);
      return f.join("");
    })();
    const F = l4.crlf === true ? "\r\n" : "\n";
    const i = l4.preserveLine + 1;
    const N = ["x;", "x}", "x{", "x(", "x)"];
    let w = T.start;
    let p = "";
    let P = l4.indentLevel;
    function U(f) {
      const g = [];
      const x = (() => {
        if (w === S - 1)
          return 1;
        if (t.lines[w + 1] - 1 > i)
          return i;
        if (t.lines[w + 1] > 1)
          return t.lines[w + 1] - 1;
        return 1;
      })();
      let m = 0;
      if (f < 0)
        f = 0;
      do {
        g.push(F);
        m = m + 1;
      } while (m < x);
      if (f > 0) {
        m = 0;
        do {
          g.push(y);
          m = m + 1;
        } while (m < f);
      }
      return g.join("");
    }
    if (l4.script.vertical === true) {
      let f = function(g) {
        let x = 0;
        let m = 0;
        let A = g - 1;
        let E = 0;
        let $ = 0;
        const q = t.begin[w];
        const R = [];
        do {
          if ((t.begin[A] === q || t.token[A] === "]" || t.token[A] === ")") && (t.token[A + 1] === ":" && t.stack[A] === "object" || t.token[A + 1] === "=")) {
            E = A;
            m = 0;
            do {
              if (t.begin[E] === q) {
                if (t.token[E] === "," || t.token[E] === ";" || t.token[E] === "x;" || b[E] > -1 && t.types[E] !== "comment") {
                  if (t.token[E + 1] === ".") {
                    m = m + l4.indentSize * l4.indentChar.length;
                  }
                  break;
                }
              } else if (b[E] > -1) {
                break;
              }
              if (t.types[E] !== "comment") {
                if (b[E - 1] === -10)
                  m = m + 1;
                m = t.token[E].length + m;
              }
              E = E - 1;
            } while (E > q);
            $ = E;
            if (t.token[$] === "," && t.token[A + 1] === "=") {
              do {
                if (t.types[$] === "end")
                  $ = t.begin[$];
                if (t.begin[$] === q) {
                  if (t.token[$] === ";" || t.token[$] === "x;")
                    break;
                  if (t.token[$] === "var" || t.token[$] === "const" || t.token[$] === "let") {
                    m = m + l4.indentSize * l4.indentChar.length;
                    break;
                  }
                }
                $ = $ - 1;
              } while ($ > q);
            }
            if (m > x)
              x = m;
            R.push([A, m]);
            A = E;
          } else if (t.types[A] === "end") {
            A = t.begin[A];
          }
          A = A - 1;
        } while (A > q);
        A = R.length;
        if (A > 0) {
          do {
            A = A - 1;
            E = R[A][1];
            if (E < x) {
              do {
                t.token[R[A][0]] = t.token[R[A][0]] + " ";
                E = E + 1;
              } while (E < x);
            }
          } while (A > 0);
        }
      };
      w = S;
      do {
        w = w - 1;
        if (t.lexer[w] === "script") {
          if (t.token[w] === "}" && t.token[w - 1] !== "{" && b[t.begin[w]] > 0) {
            f(w);
          }
        } else {
          w = t.begin[w];
        }
      } while (w > 0);
    }
    w = T.start;
    do {
      if (t.lexer[w] === _ || T.beautify[t.lexer[w]] === void 0) {
        if (t.types[w] === "comment" && l4.commentIndent === true) {
          if (/\n/.test(t.token[w])) {
            const f = t.begin[w] > -1 ? t.token[w].charAt(2) === "*" ? je(b[w], y) + l4.indentChar : je(b[w], y) : l4.indentChar;
            const g = t.token[w].split(/\n/);
            let x = 1;
            do {
              g[x] = f + g[x].trimStart();
              x = x + 1;
            } while (x < g.length);
            t.token.splice(w, 1, g.join("\n"));
          }
        }
        if (N.indexOf(t.token[w]) < 0) {
          if (t.token[w] !== ";" || l4.script.noSemicolon === false) {
            e.push(t.token[w]);
          } else if (b[w] < 0 && t.types[w + 1] !== "comment") {
            e.push(";");
          }
        }
        if (w < S - 1 && t.lexer[w + 1] !== _ && t.begin[w] === t.begin[w + 1] && t.types[w + 1].indexOf("end") < 0 && t.token[w] !== ",") {
          e.push(" ");
        } else if (b[w] > -1) {
          if ((b[w] > -1 && t.token[w] === "{" || b[w] > -1 && t.token[w + 1] === "}") && t.lines[w] < 3 && l4.script.braceNewline === true) {
            if (t.lines[w + 1] < 3)
              e.push(U(0));
          }
          e.push(U(b[w]));
          P = b[w];
        } else if (b[w] === -10) {
          e.push(" ");
          if (t.lexer[w + 1] !== _)
            P = P + 1;
        }
      } else {
        if (o[w] === w) {
          e.push(t.token[w]);
        } else {
          T.end = o[w];
          T.start = w;
          l4.indentLevel = P;
          p = T.beautify[t.lexer[w]](l4);
          e.push(p.replace(/\s+$/, ""));
          w = T.iterator;
          if (b[w] === -10) {
            e.push(" ");
          } else if (b[w] > -1) {
            e.push(U(b[w]));
          }
          l4.indentLevel = 0;
        }
      }
      w = w + 1;
    } while (w < S);
    T.iterator = S - 1;
    return e.join("");
  })();
  return a;
};
var we = { language: { description: "The language name", lexer: "all", type: "select", default: "auto", values: [{ rule: "auto", description: "Prettify will automatically detect the language" }, { rule: "text", description: "Plain Text" }, { rule: "html", description: "HTML" }, { rule: "liquid", description: "HTML + Liquid" }, { rule: "javascript", description: "JavaScript" }, { rule: "jsx", description: "JSX" }, { rule: "typescript", description: "TypeScript" }, { rule: "tsx", description: "TSX" }, { rule: "json", description: "JSON" }, { rule: "css", description: "CSS" }, { rule: "scss", description: "SCSS" }, { rule: "less", description: "LESS" }, { rule: "xml", description: "XML" }] }, wrap: { default: 0, description: "Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.", lexer: "all", type: "number" }, indentSize: { default: 2, description: 'The number of "indentChar" values to comprise a single indentation.', lexer: "all", type: "number" }, indentChar: { default: " ", description: "The string characters to comprise a single indentation. Any string combination is accepted.", lexer: "all", type: "string" }, crlf: { default: false, description: "If line termination should be Windows (CRLF) format. Unix (LF) format is the default.", lexer: "all", type: "boolean" }, endNewline: { default: false, description: "Insert an empty line at the end of output.", lexer: "all", type: "boolean" }, preserveLine: { default: 2, description: "The maximum number of consecutive empty lines to retain.", lexer: "all", type: "number" }, preserveComment: { default: false, description: "Prevent comment reformatting due to option wrap.", lexer: "all", type: "boolean" }, commentNewline: { default: false, description: "If a blank new line should be forced above comments.", lexer: "all", type: "boolean" }, commentIndent: { default: false, description: "This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.", lexer: "all", type: "boolean" }, correct: { default: false, description: "Automatically correct some sloppiness in code.", lexer: "all", type: "boolean" }, quoteConvert: { lexer: "all", description: "If the quotes should be converted to single quotes or double quotes.", type: "select", default: "none", values: [{ rule: "none", description: "Ignores this option" }, { rule: "single", description: "Converts double quotes to single quotes" }, { rule: "double", description: "Converts single quotes to double quotes" }] }, attributeSort: { default: false, description: "Alphanumerically sort markup attributes. Attribute sorting is ignored on tags that contain attributes template attributes.", lexer: "markup", type: "boolean" }, attributeSortList: { default: [], description: "A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires 'attributeSort' have a value of true.", lexer: "markup", type: "array" }, attributeCasing: { default: "preserve", description: "Controls the casing of attribute values and keys.", type: "select", lexer: "markup", values: [{ rule: "preserve", description: "All tag attribute keys/values are preserved and left intact." }, { rule: "lowercase", description: "All tag attribute keys/values are converted to lowercase" }, { rule: "lowercase-name", description: "Only attribute keys are converted to lowercase" }, { rule: "lowercase-value", description: "Only attribute values are converted to lowercase" }] }, attributeValues: { default: false, description: "Controls how attribute values should be formatter", type: "select", lexer: "markup", values: [{ rule: "preserve", description: "Preserves attribute values, leaving them intact." }, { rule: "collapse", description: "Collapsed all space separated attributes values onto newlines" }, { rule: "wrap", description: "Collapase attribute values when then exceed wrap limit" }, { rule: "strip", description: "Strips newlines and extraneous whitespaces from attribute values" }] }, delimiterSpacing: { default: true, description: "Whether or not delimiter characters should apply a single space at the start and end point", lexer: "markup", type: "boolean" }, forceAttribute: { default: false, description: "If all markup attributes should be indented each onto their own line. This option accepts either a boolean or number value, depending on your preferences you can either force attributes based a count limit, disable forcing or always enable enforcing.", lexer: "markup", type: ["number", "boolean"], multi: { number: { default: 1, description: "Optionally define an attribute force threshold. When the number of attributes exceeds this limit then they will be forced, otherwise they will be left intact." }, boolean: { default: false, description: "Whether or not to enforce the rule. A value of true will always force attributes, whereas a value of false will never force attributes." } } }, forceLeadAttribute: { default: false, description: "Forces leading attribute onto a newline when using wrap based indentation.", lexer: "markup", type: "boolean" }, forceIndent: { default: false, description: "Will force indentation upon all content and tags without regard for the creation of new text nodes.", lexer: "markup", type: "boolean" }, preserveAttributes: { default: false, description: "If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.", lexer: "markup", type: "boolean" }, preserveText: { default: false, description: "If text in the provided markup code should be preserved exactly as provided. This option eliminates beautification and wrapping of text content.", lexer: "markup", type: "boolean" }, selfCloseSpace: { default: false, description: 'Markup self-closing tags end will end with " />" instead of "/>".', lexer: "markup", type: "boolean" }, classPadding: { description: "Inserts new line characters between every CSS code block.", default: false, type: "boolean", lexer: "style" }, sortSelectors: { default: false, type: "boolean", description: "If comma separated CSS selectors should present on a single line of code.", lexer: "style" }, sortProperties: { lexer: "style", description: "This option will alphabetically sort CSS properties contained within classes.", default: false, type: "boolean" }, noLeadZero: { lexer: "style", description: "This will eliminate leading zeros from numbers expressed within values.", default: false, type: "boolean" }, compressCSS: { lexer: "style", description: "If CSS should be beautified in a style where the properties and values are minifed for faster reading of selectors.", default: false, type: "boolean" }, forceValue: { lexer: "style", description: "If CSS selector property values should be indented onto newlines", default: "preserve", type: "select", values: [{ rule: "preserve", description: "Preserves property values, output does not augment provided structures" }, { rule: "collapse", description: "Collapsed all selector property values onto newlines" }, { rule: "wrap", description: "Collapase only selector property values which exceed wrap limit" }] }, braceAllman: { lexer: "script", default: false, description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line, otherwise known as "Allman Style" indentation.', type: "boolean" }, bracePadding: { default: false, description: "This will create a newline before and after objects values", type: "boolean", lexer: "script" }, braceNewline: { default: false, description: "If true an empty line will be inserted after opening curly braces and before closing curly braces.", type: "boolean", lexer: "script" }, braceStyle: { default: "none", description: "Emulates JSBeautify's brace_style option using existing Prettify options", type: "select", lexer: "script", values: [{ rule: "none", description: "Ignores this option" }, { rule: "collapse", description: "Sets formatObject to indent and neverflatten to true." }, { rule: "collapse-preserve-inline", description: "Sets formatObject to inline and bracePadding to true" }, { rule: "expand", description: "Sets objectIndent to indent and braceNewline + neverflatten to true." }] }, arrayFormat: { lexer: "script", description: "Determines if all array indexes should be indented, never indented, or left to the default", type: "select", default: "default", values: [{ rule: "default", description: "Default formatting" }, { rule: "indent", description: "Always indent each index of an array" }, { rule: "inline", description: "Ensure all array indexes appear on a single line" }] }, objectSort: { default: false, description: "This option will alphabetically sort object properties in JSON objects", type: "boolean", lexer: "script" }, objectIndent: { description: "This option will alphabetically sort object properties in JSON objects", type: "select", lexer: "script", default: "default", values: [{ rule: "default", description: "Default formatting" }, { rule: "indent", description: "Always indent each index of an array" }, { rule: "inline", description: "Ensure all array indexes appear on a single line" }] }, functionSpace: { lexer: "script", default: true, type: "boolean", description: "Inserts a space following the function keyword for anonymous functions." }, functionNameSpace: { lexer: "script", default: true, type: "boolean", description: "If a space should follow a JavaScript function name." }, methodChain: { lexer: "script", default: -1, description: "When to break consecutively chained methods and properties onto separate lines. A negative value disables this option. A value of 0 ensures method chainsare never broken.", type: "number" }, caseSpace: { default: false, type: "boolean", description: "If the colon separating a case's expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.", lexer: "script" }, inlineReturn: { lexer: "script", default: true, type: "boolean", description: "Inlines return statements contained within `if` and `else` conditions. This rules also augments code and will reason about your structure to output the best and most readable results." }, elseNewline: { lexer: "script", default: false, type: "boolean", description: 'If keyword "else" is forced onto a new line.' }, ternaryLine: { lexer: "script", description: "If ternary operators in JavaScript `?` and `:` should remain on the same line.", type: "boolean", default: false }, neverFlatten: { lexer: "script", default: true, description: "If destructured lists in script should never be flattend.", type: "boolean" }, variableList: { lexer: "script", description: "If consecutive JavaScript variables should be merged into a comma separated list or if variables in a list should be separated. each \u2014 Ensure each reference is a single declaration statement.", type: "select", default: "none", values: [{ rule: "none", description: "Ignores this option" }, { rule: "each", description: "Ensure each reference is a single declaration statement" }, { rule: "list", description: "Ensure consecutive declarations are a comma separated list" }] }, vertical: { lexer: "script", description: "If lists of assignments and properties should be vertically aligned", type: "boolean", default: false }, noCaseIndent: { lexer: "script", description: "If the colon separating a case's expression (of a switch/case block) from its statement should be followed by a space instead of indentation, thereby keeping the case on a single line of code.", default: false, type: "boolean" }, noSemicolon: { lexer: "script", description: "Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.", default: false, type: "boolean" }, endComma: { description: "If there should be a trailing comma in arrays and objects.", type: "select", lexer: "script", default: "none", values: [{ rule: "none", description: "Ignore this option" }, { rule: "always", description: "Always ensure there is a tailing comma" }, { rule: "never", description: "Remove trailing commas" }] } };
var et = {};
nt(et, { format: () => Qe, language: () => _e, options: () => Ee, parse: () => Ye });
function Je(l4) {
  const c = l4.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@prettify\s+(\w+)?\s*{\s+/);
  const h = l4.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@prettify-ignore\b/);
  const n = ve(we);
  const o = n.length;
  let t = 0;
  if (h > -1 && l4.source.slice(0, h).trimStart() === "")
    return false;
  if (c > -1 && (c === 0 || `"':`.indexOf(l4.source.charAt(c - 1)) < 0)) {
    let g = function() {
      if (a.charAt(y - 1) !== "\\")
        return false;
      let x = y;
      do {
        x = x - 1;
      } while (x > 0 && a.charAt(x) === "\\");
      return (y - x) % 2 === 0;
    };
    const S = [];
    const b = c;
    const a = l4.source;
    const e = a.length;
    let y = b;
    let F = 0;
    let i = "";
    let N = "";
    let w = "";
    let p = "";
    let P = [];
    let U = [];
    let V;
    let f;
    if (a.charAt(y) === "<") {
      f = "<!--";
    } else if (a.charAt(y + 1) === "/") {
      f = "//";
    } else if (a.charAt(y + 1) === "%") {
      V = a.indexOf("}", y + 1);
      if (a[V - 1].charCodeAt(0) === 37)
        f = a.slice(y, V + 1);
    } else {
      f = "/*";
    }
    do {
      if (a.slice(y - 9, y) === "@prettify")
        break;
      y = y + 1;
    } while (y < e);
    do {
      if (g() === false) {
        if (i === "") {
          if (a.charAt(y) === '"' || a.charAt(y) === "'" || a.charAt(y) === "`") {
            i = a.charAt(y);
            if (S.length > 0 && S[S.length - 1].charAt(S[S.length - 1].length - 1) === ":")
              F = y;
          } else if (/\s/.test(a.charAt(y)) === false && F === 0) {
            F = y;
          } else if (a.charAt(y) === "," || /\s/.test(a.charAt(y)) === true && F > 0) {
            N = a.slice(F, y);
            if (S.length > 0) {
              if (S.length > 0 && N === ":" && S[S.length - 1].indexOf(":") < 0) {
                S[S.length - 1] = S[S.length - 1] + N;
                F = y;
              } else if (S.length > 0 && S[S.length - 1].charAt(S[S.length - 1].length - 1) === ":") {
                S[S.length - 1] = S[S.length - 1] + N;
                F = 0;
              } else {
                S.push(N);
                F = 0;
              }
            } else {
              S.push(N);
              F = 0;
            }
          }
          if (f === "<!--" && a.slice(y - 2, y + 1) === "-->")
            break;
          if (f === "//" && a.charAt(y) === "\n")
            break;
          if (f === "/*" && a.slice(y - 1, y + 1) === "*/")
            break;
          if (f.charCodeAt(1) === 37 && a.slice(y - 1, y + 1) === "%" && a.indexOf("endcomment", a.indexOf("{%", V)) > 0)
            break;
        } else if (a.charAt(y) === i && i !== "${") {
          i = "";
        } else if (i === "`" && a.slice(y, y + 2) === "${") {
          i = "${";
        } else if (i === "${" && a.charAt(y) === "}") {
          i = "`";
        }
      }
      y = y + 1;
    } while (y < e);
    if (F > 0) {
      i = a.slice(F, y + 1);
      if (f === "<!--")
        i = i.replace(/\s*-+>$/, "");
      else if (f === "//")
        i = i.replace(/\s+$/, "");
      else
        i = i.replace(/\s*\u002a\/$/, "");
      S.push(i);
    }
    y = S.length;
    if (y > 0) {
      do {
        y = y - 1;
        if (S[y].indexOf(":") > 0) {
          U = [S[y].slice(0, S[y].indexOf(":")), S[y].slice(S[y].indexOf(":") + 1)];
        } else if (we[S[y]] !== void 0 && we[S[y]].type === "boolean") {
          l4.options[S[y]] = true;
        }
        if (U.length === 2 && we[U[0]] !== void 0) {
          if (U[1].charAt(U[1].length - 1) === U[1].charAt(0) && (U[1].charAt(0) === '"' || U[1].charAt(0) === "'" || U[1].charAt(0) === "`")) {
            U[1] = U[1].slice(1, U[1].length - 1);
          }
          if (we[U[0]].type === "number" && isNaN(Number(U[1])) === false) {
            l4.options[U[0]] = Number(U[1]);
          } else if (we[U[0]].type === "boolean") {
            l4.options[U[0]] = U[1] === "true";
          } else {
            if (we[U[0]].values !== void 0) {
              P = ve(we[U[0]].values);
              F = P.length;
              do {
                F = F - 1;
                if (P[F] === U[1]) {
                  l4.options[U[0]] = U[1];
                  break;
                }
              } while (F > 0);
            } else {
              if (U[0] === "language") {
                w = U[1];
              } else if (U[0] === "lexer") {
                p = U[1];
              }
              l4.options[U[0]] = U[1];
            }
          }
        }
      } while (y > 0);
      if (p === "" && w !== "")
        p = Fe(w);
    }
  }
  if (l4.options.lexer === "script") {
    if (l4.options.script.styleGuide !== void 0) {
      switch (l4.options.script.styleGuide) {
        case "airbnb":
          l4.options.wrap = 80;
          l4.options.indentChar = " ";
          l4.options.indentSize = 2;
          l4.options.preserveLine = 1;
          l4.options.script.correct = true;
          l4.options.script.quoteConvert = "single";
          l4.options.script.variableList = "each";
          l4.options.script.endComma = "always";
          l4.options.script.bracePadding = true;
          break;
        case "crockford":
          l4.options.indentChar = " ";
          l4.options.indentSize = 4;
          l4.options.script.correct = true;
          l4.options.script.bracePadding = false;
          l4.options.script.elseNewline = false;
          l4.options.script.endComma = "never";
          l4.options.script.noCaseIndent = true;
          l4.options.script.functionSpace = true;
          l4.options.script.variableList = "each";
          l4.options.script.vertical = false;
          break;
        case "google":
          l4.options.wrap = -1;
          l4.options.indentChar = " ";
          l4.options.indentSize = 4;
          l4.options.preserveLine = 1;
          l4.options.script.correct = true;
          l4.options.script.quoteConvert = "single";
          l4.options.script.vertical = false;
          break;
        case "jquery":
          l4.options.wrap = 80;
          l4.options.indentChar = "	";
          l4.options.indentSize = 1;
          l4.options.script.correct = true;
          l4.options.script.bracePadding = true;
          l4.options.script.quoteConvert = "double";
          l4.options.script.variableList = "each";
          break;
        case "jslint":
          l4.options.indentChar = " ";
          l4.options.indentSize = 4;
          l4.options.script.correct = true;
          l4.options.script.bracePadding = false;
          l4.options.script.elseNewline = false;
          l4.options.script.endComma = "never";
          l4.options.script.noCaseIndent = true;
          l4.options.script.functionSpace = true;
          l4.options.script.variableList = "each";
          l4.options.script.vertical = false;
          break;
        case "standard":
          l4.options.wrap = 0;
          l4.options.indentChar = " ";
          l4.options.indentSize = 2;
          l4.options.endNewline = false;
          l4.options.preserveLine = 1;
          l4.options.script.correct = true;
          l4.options.script.noSemicolon = true;
          l4.options.script.endComma = "never";
          l4.options.script.braceNewline = false;
          l4.options.script.bracePadding = false;
          l4.options.script.braceAllman = false;
          l4.options.script.quoteConvert = "single";
          l4.options.script.functionSpace = true;
          l4.options.script.ternaryLine = false;
          l4.options.script.variableList = "each";
          l4.options.script.vertical = false;
          break;
        case "yandex":
          l4.options.script.correct = true;
          l4.options.script.bracePadding = false;
          l4.options.script.quoteConvert = "single";
          l4.options.script.variableList = "each";
          l4.options.script.vertical = false;
          break;
      }
    }
    if (l4.options.script.braceStyle !== void 0) {
      switch (l4.options.script.braceStyle) {
        case "collapse":
          l4.options.script.braceNewline = false;
          l4.options.script.bracePadding = false;
          l4.options.script.braceAllman = false;
          l4.options.script.objectIndent = "indent";
          l4.options.script.neverFlatten = true;
          break;
        case "collapse-preserve-inline":
          l4.options.script.braceNewline = false;
          l4.options.script.bracePadding = true;
          l4.options.script.braceAllman = false;
          l4.options.script.objectIndent = "indent";
          l4.options.script.neverFlatten = false;
          break;
        case "expand":
          l4.options.script.braceNewline = false;
          l4.options.script.bracePadding = false;
          l4.options.script.braceAllman = true;
          l4.options.script.objectIndent = "indent";
          l4.options.script.neverFlatten = true;
          break;
      }
    }
    if (l4.options.language === "json")
      l4.options.wrap = 0;
  }
  do {
    if (l4.options[ve[t]] !== void 0) {
      we[ve[t]].lexer.length;
    }
    t = t + 1;
  } while (t < o);
}
function rt(l4) {
  const { source: c, options: h } = l4;
  const { lexer: n, language: o } = h;
  if (typeof l4.lexers[n] === "function") {
    l4.lexers[n](`${c} `);
  } else {
    s.error = `Specified lexer, ${n}, is not a function.`;
  }
  let t = 0;
  let _ = 0;
  const I = ve(s.data);
  const S = I.length;
  do {
    _ = t + 1;
    do {
      if (s.data[I[t]].length !== s.data[I[_]].length) {
        s.error = `"${I[t]}" array is of different length than "${I[_]}"`;
        break;
      }
      _ = _ + 1;
    } while (_ < S);
    t = t + 1;
  } while (t < S - 1);
  if (s.data.begin.length > 0) {
    if (n === "script" && (o === "json" && h.json.objectSort === true || h.language !== "json" && h.script.objectSort === true)) {
      s.sortCorrection(0, s.count + 1);
    } else if (n === "style" && h.style.sortProperties) {
      s.sortCorrection(0, s.count + 1);
    }
  }
  return s.data;
}
function Ke(l4) {
  const c = Date.now();
  const h = { language: l4, chars: -1 };
  return (n) => {
    h.chars = n;
    h.size = Ze(n);
    h.time = (Date.now() - c).toFixed(1);
    return h;
  };
}
function lt(l4) {
  const { languageName: c } = he(l4.options.language);
  const h = l4.options.crlf === true ? "\r\n" : "\n";
  const n = l4.source.match(/\n/g);
  const o = Ke(c);
  let t = C;
  if (n === null) {
    if (l4.options.endNewline)
      t = h;
    l4.stats = o(t.length);
  } else {
    t = n[0].length > l4.options.preserveLine ? je(l4.options.preserveLine, h) : je(n[0].length, h);
    if (l4.options.endNewline)
      t += h;
    l4.stats = o(t.length);
  }
  return t;
}
function ze(l4) {
  l4.data = s.init();
  if (!/\S/.test(l4.source))
    return lt(l4);
  if (l4.options.language === "text") {
    l4.options.language = "text";
    l4.options.languageName = "Plain Text";
    l4.options.lexer = "markup";
  } else if (l4.options.language === "auto" || l4.options.language === void 0) {
    const { lexer: t, language: _, languageName: I } = _e(l4.source);
    if (_ === "unknown") {
      console.warn("Prettify: unknown and/or unsupport language");
      console.info("Prettify: define a support language (fallback is HTML)");
    }
    l4.options.lexer = t;
    l4.options.language = _;
    l4.options.languageName = I;
  } else {
    const { lexer: t, language: _, languageName: I } = he(l4.options.language);
    if (_ === "unknown") {
      console.warn(`Prettify: unsupport ${l4.options.language}`);
      console.info("Prettify: language is not supported (fallback is HTML)");
    }
    l4.options.lexer = t;
    l4.options.language = _;
    l4.options.languageName = I;
  }
  const c = Ke(l4.options.languageName);
  const h = l4.mode;
  const n = l4.options.crlf === true ? "\r\n" : "\n";
  let o = l4.source;
  if (Je(l4) === false) {
    l4.stats = c(o.length);
    return o;
  }
  l4.data = rt(l4);
  if (h === "parse") {
    l4.stats = c(o.length);
    return s.data;
  }
  o = l4.beautify[l4.options.lexer](l4.options);
  o = l4.options.endNewline === true ? o.replace(/\s*$/, n) : o.replace(/\s+$/, C);
  l4.stats = c(o.length);
  l4.end = 0;
  l4.start = 0;
  return o;
}
Qe.before = (l4) => T.hooks.before.push(l4);
Qe.after = (l4) => T.hooks.after.push(l4);
Ee.listen = (l4) => T.hooks.rules.push(l4);
qe(Qe, "stats", { get() {
  return T.stats;
} });
qe(Ye, "stats", { get() {
  return T.stats;
} });
qe(Ee, "rules", { get() {
  return T.options;
} });
function Qe(l4, c) {
  T.source = l4;
  if (typeof c === "object")
    T.options = Ee(c);
  if (T.hooks.before.length > 0) {
    for (const n of T.hooks.before) {
      if (n(T.options, l4) === false)
        return l4;
    }
  }
  const h = ze(T);
  if (T.hooks.after.length > 0) {
    for (const n of T.hooks.after) {
      if (n.call(s.data, h, T.options) === false)
        return l4;
    }
  }
  return new Promise((n, o) => {
    if (s.error.length)
      return o(s.error);
    return n(h);
  });
}
function Ee(l4) {
  for (const c of ve(l4)) {
    if (c in we && we[c].lexer === "auto") {
      T.options[c] = l4[c];
    } else if (c === "markup") {
      Ce(T.options.markup, l4.markup);
    } else if (c === "script") {
      Ce(T.options.script, l4.script);
    } else if (c === "style") {
      Ce(T.options.style, l4.style);
    } else if (c === "json") {
      Ce(T.options.json, l4.json);
    } else if (c === "grammar") {
      le.extend(l4.grammar);
    } else if (c in T.options) {
      T.options[c] = l4[c];
    }
  }
  if (T.hooks.rules.length > 0) {
    for (const c of T.hooks.rules)
      c(T.options);
  }
  return T.options;
}
function Ye(l4, c) {
  T.source = l4;
  T.mode = "parse";
  if (typeof c === "object")
    T.options = Ee(c);
  const h = ze(T);
  return new Promise((n, o) => {
    if (s.error.length)
      return o(s.error);
    return n(h);
  });
}

// src/extension/config.ts
var import_vscode2 = require("vscode");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));

// src/extension/utils.ts
var import_vscode = require("vscode");
var Utils = class {
  constructor() {
    this.error = false;
    this.barItem = import_vscode.window.createStatusBarItem(import_vscode.StatusBarAlignment.Right, -2);
    this.outputChannel = import_vscode.window.createOutputChannel("Liquid");
  }
  statusBarItem(type, show) {
    const types = {
      enabled: {
        text: "\u{1F4A7} Liquid: $(check)",
        tooltip: "Enable/Disable Liquid Formatting",
        command: "liquid.disableFormatting"
      },
      disabled: {
        text: "\u{1F4A7} Liquid: $(x)",
        tooltip: "Enable Liquid Formatting",
        command: "liquid.enableFormatting"
      },
      error: {
        text: "\u26A0\uFE0F Liquid: $(check)",
        tooltip: "Errors detected! Toggle output",
        command: "liquid.toggleOutput"
      }
    };
    Object.assign(this.barItem, types[type]);
    if (show !== void 0)
      return show ? this.barItem.show() : this.barItem.hide();
  }
  outputLog({
    title,
    message,
    show = false
  }) {
    const date = new Date().toLocaleString();
    this.outputChannel.appendLine(`[${date}] ${title}: ${message}`);
    if (show) {
      this.error = true;
      this.statusBarItem("error");
      this.outputChannel.show();
    }
  }
};

// src/extension/config.ts
var Config = class extends Utils {
  constructor() {
    super();
    this.liquid = import_vscode2.workspace.getConfiguration("liquid");
    this.format = false;
    this.watch = false;
    this.error = false;
    this.reset = false;
    this.config = {};
    this.liquid = import_vscode2.workspace.getConfiguration("liquid");
    this.format = this.liquid.get("format");
    if (import_vscode2.workspace.workspaceFolders !== void 0) {
      this.rcfile = import_path.default.join(import_vscode2.workspace.workspaceFolders[0].uri.fsPath, ".liquidrc");
    }
    this.watch = false;
    this.error = false;
    this.reset = false;
  }
  setFormattingRules() {
    var _a;
    if (!import_fs.default.existsSync(this.rcfile)) {
      const liquid = import_vscode2.workspace.getConfiguration("liquid");
      const config = liquid.get("rules");
      et.options(config);
      this.config = (_a = et.options) == null ? void 0 : _a.rules;
    } else {
      try {
        const file = import_fs.default.readFileSync(this.rcfile, "utf8");
        const json = JSON.parse(file);
        et.options(json.prettify);
        this.outputLog({ title: "Prettify", message: "Updated Formatting Rules" });
        this.error = false;
      } catch (error) {
        this.outputLog({
          title: "Error reading formatting rules",
          file: this.rcfile,
          message: error.message,
          show: true
        });
      } finally {
        this.rcfileWatcher();
      }
    }
  }
  rcfileWatcher() {
    if (!this.watch) {
      const watch = import_vscode2.workspace.createFileSystemWatcher(this.rcfile, true, false, false);
      watch.onDidDelete(() => this.setFormattingRules());
      watch.onDidChange(() => {
        this.reset = true;
        this.setFormattingRules();
      });
      this.watch = true;
    }
  }
  async rcfileGenerate() {
    if (import_fs.default.existsSync(this.rcfile)) {
      const answer = await import_vscode2.window.showErrorMessage(".liquidrc file already exists!", "Open");
      if (answer === "Open") {
        import_vscode2.workspace.openTextDocument(this.rcfile).then((document) => {
          import_vscode2.window.showTextDocument(document, 1, false);
        }, (error) => {
          return console.error(error);
        });
      }
    }
    const liquid = import_vscode2.workspace.getConfiguration("liquid");
    const rules = JSON.stringify(liquid.rules, null, 2);
    import_fs.default.writeFile(this.rcfile, rules, (error) => {
      if (error) {
        return this.outputLog({
          title: "Error generating rules",
          file: this.rcfile,
          message: error.message,
          show: true
        });
      }
      import_vscode2.workspace.openTextDocument(this.rcfile).then((document) => {
        import_vscode2.window.showTextDocument(document, 1, false);
      }, (error2) => {
        return console.error(error2);
      }).then(() => {
        this.rcfileWatcher();
        return import_vscode2.window.showInformationMessage("You are now using a .liquidrc file to define formatting rules \u{1F44D}");
      });
    });
  }
};

// src/extension/format.ts
var Format = class extends Config {
  async completeDocument() {
    if (import_vscode3.window.activeTextEditor === void 0)
      return;
    const { activeTextEditor } = import_vscode3.window;
    const { document } = activeTextEditor;
    const range = Format.range(document);
    const input = document.getText(range);
    try {
      const output = await et.format(input, { language: document.languageId });
      await activeTextEditor.edit((code) => code.replace(range, output));
    } catch (error) {
      this.outputLog({ title: "Prettify", message: `${error}` });
    }
  }
  async selectedText() {
    if (import_vscode3.window.activeTextEditor === void 0)
      return;
    const { activeTextEditor } = import_vscode3.window;
    const { document, selection } = activeTextEditor;
    const input = document.getText(selection);
    try {
      const output = await et.format(input);
      await activeTextEditor.edit((code) => code.replace(selection, output));
    } catch (error) {
      this.outputLog({ title: "Prettify", message: `${error}` });
    }
  }
  static range(document) {
    const range = document.getText().length - 1;
    const first = document.positionAt(0);
    const last = document.positionAt(range);
    return new import_vscode3.Range(first, last);
  }
};

// src/extension/document.ts
var Document = class extends Format {
  constructor() {
    super();
    this.handler = {};
    this.setFormattingRules();
  }
  onConfigChanges() {
    this.error = false;
    this.dispose();
    this.setFormattingRules();
    this.onOpenTextDocument();
  }
  onOpenTextDocument() {
    if (import_vscode4.window.activeTextEditor === void 0)
      return;
    const { fileName, languageId } = import_vscode4.window.activeTextEditor.document;
    if (this.error)
      this.statusBarItem("error", true);
    if (languageId !== "html") {
      this.dispose();
      this.barItem.hide();
      return;
    }
    if (!import_vscode4.workspace.getConfiguration("editor").formatOnSave) {
      this.format = false;
    }
    if (!this.format) {
      this.dispose();
      this.statusBarItem("disabled", true);
      return;
    }
    if (fileName in this.handler)
      this.handler[fileName].dispose();
    if (!this.error && this.format)
      this.statusBarItem("enabled", true);
    this.handler[fileName] = import_vscode4.languages.registerDocumentFormattingEditProvider({
      scheme: "file",
      language: "html"
    }, {
      async provideDocumentFormattingEdits(document, options, provider) {
        const range = Format.range(document);
        const input = document.getText(range);
        try {
          const output = await et.format(input, { language: document.languageId });
          return [
            import_vscode4.TextEdit.replace(range, output)
          ];
        } catch (error) {
          this.outputLog({ title: "Prettify", message: `${error}` });
        }
      }
    });
  }
  dispose() {
    for (const key in this.handler)
      if (key in this.handler)
        this.handler[key].dispose();
  }
  selection() {
    try {
      this.selectedText();
      import_vscode4.window.showInformationMessage("Selection Formatted \u{1F4A7}");
    } catch (error) {
      import_vscode4.window.showInformationMessage("Format Failed! The selection is invalid or incomplete!");
      this.outputChannel.appendLine(`\u{1F4A7} Liquid: ${error}`);
    }
  }
  liquidrc() {
    return this.rcfileGenerate();
  }
  async document() {
    try {
      await this.completeDocument();
      import_vscode4.window.showInformationMessage("Document Formatted \u{1F4A7}");
    } catch (error) {
      console.log(error);
      import_vscode4.window.showInformationMessage("Document could not be formatted, check your code!");
      this.outputChannel.appendLine(`\u{1F4A7} Liquid: ${error}`);
    }
  }
  output() {
    return this.outputChannel.show();
  }
  async enable() {
    this.format = true;
    await this.liquid.update("format", this.format, import_vscode4.ConfigurationTarget.Global);
    return await import_vscode4.window.showInformationMessage("Liquid Formatting Enabled \u{1F4A7}");
  }
  async disable() {
    this.format = false;
    await this.liquid.update("format", this.format, import_vscode4.ConfigurationTarget.Global);
    return await import_vscode4.window.showInformationMessage("Liquid Formatting Disabled \u{1F4A7}");
  }
};

// src/extension.ts
exports.activate = (context) => {
  const { registerCommand } = import_vscode5.commands;
  const subscribe = context.subscriptions;
  const active = import_vscode5.window.activeTextEditor;
  const document = new Document();
  const {
    liquidrc,
    onConfigChanges,
    onOpenTextDocument,
    disable,
    enable,
    selection,
    output
  } = document;
  subscribe.push(registerCommand("liquid.liquidrc", liquidrc.bind(document)));
  if (!active || !active.document)
    return;
  subscribe.push(import_vscode5.workspace.onDidChangeConfiguration(onConfigChanges.bind(document)));
  subscribe.push(import_vscode5.workspace.onDidOpenTextDocument(onOpenTextDocument.bind(document)));
  subscribe.push(registerCommand("liquid.disableFormatting", disable.bind(document)));
  subscribe.push(registerCommand("liquid.enableFormatting", enable.bind(document)));
  subscribe.push(registerCommand("liquid.formatSelection", selection.bind(document)));
  subscribe.push(registerCommand("liquid.toggleOutput", output.bind(document)));
};
