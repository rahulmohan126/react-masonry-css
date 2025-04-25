'use strict';

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const _excluded = ["children", "breakpointCols", "columnClassName", "columnAttrs", "column", "className"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const defaultProps = {
  breakpointCols: undefined,
  // optional, number or object { default: number, [key: number]: number }
  className: undefined,
  // required, string
  columnClassName: undefined,
  // optional, string

  // Any React children. Typically an array of JSX items
  children: undefined,
  // Custom attributes, however it is advised against
  // using these to prevent unintended issues and future conflicts
  // ...any other attribute, will be added to the container
  columnAttrs: undefined,
  // object, added to the columns

  // Deprecated props
  // The column property is deprecated.
  // It is an alias of the `columnAttrs` property
  column: undefined
};
const DEFAULT_COLUMNS = 2;
class Masonry extends React__default["default"].Component {
  constructor(props) {
    super(props);

    // Correct scope for when methods are accessed externally
    this.reCalculateColumnCount = this.reCalculateColumnCount.bind(this);
    this.reCalculateColumnCountDebounce = this.reCalculateColumnCountDebounce.bind(this);

    // default state
    let columnCount;
    if (this.props.breakpointCols && this.props.breakpointCols.default) {
      columnCount = this.props.breakpointCols.default;
    } else {
      columnCount = parseInt(this.props.breakpointCols) || DEFAULT_COLUMNS;
    }
    this.state = {
      columnCount
    };
  }
  componentDidMount() {
    this.reCalculateColumnCount();

    // window may not be available in some environments
    if (window) {
      window.addEventListener('resize', this.reCalculateColumnCountDebounce);
    }
  }
  componentDidUpdate() {
    this.reCalculateColumnCount();
  }
  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.reCalculateColumnCountDebounce);
    }
  }
  reCalculateColumnCountDebounce() {
    if (!window || !window.requestAnimationFrame) {
      // IE10+
      this.reCalculateColumnCount();
      return;
    }
    if (window.cancelAnimationFrame) {
      // IE10+
      window.cancelAnimationFrame(this._lastRecalculateAnimationFrame);
    }
    this._lastRecalculateAnimationFrame = window.requestAnimationFrame(() => {
      this.reCalculateColumnCount();
    });
  }
  reCalculateColumnCount() {
    const windowWidth = window && window.innerWidth || Infinity;
    let breakpointColsObject = this.props.breakpointCols;

    // Allow passing a single number to `breakpointCols` instead of an object
    if (typeof breakpointColsObject !== 'object') {
      breakpointColsObject = {
        default: parseInt(breakpointColsObject) || DEFAULT_COLUMNS
      };
    }
    let matchedBreakpoint = Infinity;
    let columns = breakpointColsObject.default || DEFAULT_COLUMNS;
    for (let breakpoint in breakpointColsObject) {
      const optBreakpoint = parseInt(breakpoint);
      const isCurrentBreakpoint = optBreakpoint > 0 && windowWidth <= optBreakpoint;
      if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
        matchedBreakpoint = optBreakpoint;
        columns = breakpointColsObject[breakpoint];
      }
    }
    columns = Math.max(1, parseInt(columns) || 1);
    if (this.state.columnCount !== columns) {
      this.setState({
        columnCount: columns
      });
    }
  }
  itemsInColumns() {
    const currentColumnCount = this.state.columnCount;
    const itemsInColumns = Array.from({
      length: currentColumnCount
    }, () => []);

    // Force children to be handled as an array
    const items = React__default["default"].Children.toArray(this.props.children);
    const columnHeights = Array(currentColumnCount).fill(0);
    for (let i = 0; i < items.length; i++) {
      const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      console.log(columnHeights);
      console.log(columnIndex);
      itemsInColumns[columnIndex].push(items[i]);
      columnHeights[columnIndex] += items[i].props.height || 1;
    }
    return itemsInColumns;
  }
  renderColumns() {
    const {
      column,
      columnAttrs = {},
      columnClassName
    } = this.props;
    const childrenInColumns = this.itemsInColumns();
    const columnWidth = `${100 / childrenInColumns.length}%`;
    let className = columnClassName;
    if (className && typeof className !== 'string') {
      this.logDeprecated('The property "columnClassName" requires a string');

      // This is a deprecated default and will be removed soon.
      if (typeof className === 'undefined') {
        className = 'my-masonry-grid_column';
      }
    }
    const columnAttributes = _objectSpread(_objectSpread(_objectSpread({}, column), columnAttrs), {}, {
      style: _objectSpread(_objectSpread({}, columnAttrs.style), {}, {
        width: columnWidth
      }),
      className
    });
    return childrenInColumns.map((items, i) => {
      return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, columnAttributes, {
        key: i
      }), items);
    });
  }
  logDeprecated(message) {
    console.error('[Masonry]', message);
  }
  render() {
    const _this$props = this.props,
      {
        // ignored
        children,
        breakpointCols,
        columnClassName,
        columnAttrs,
        column,
        // used
        className
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    let classNameOutput = className;
    if (typeof className !== 'string') {
      this.logDeprecated('The property "className" requires a string');

      // This is a deprecated default and will be removed soon.
      if (typeof className === 'undefined') {
        classNameOutput = 'my-masonry-grid';
      }
    }
    return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, rest, {
      className: classNameOutput
    }), this.renderColumns());
  }
}
Masonry.defaultProps = defaultProps;

module.exports = Masonry;
