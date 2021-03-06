import cx from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {
  createHTMLDivision,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
  SUI,
  useKeyOnly,
  useValueAndKey,
} from '../../lib'

/**
 * A progress bar shows the progression of a task.
 */
class Progress extends Component {
  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** A progress bar can show activity. */
    active: PropTypes.bool,

    /** A progress bar can attach to and show the progress of an element (i.e. Card or Segment). */
    attached: PropTypes.oneOf(['top', 'bottom']),

    /** Whether success state should automatically trigger when progress completes. */
    autoSuccess: PropTypes.bool,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** A progress bar can have different colors. */
    color: PropTypes.oneOf(SUI.COLORS),

    /** A progress bar be disabled. */
    disabled: PropTypes.bool,

    /** A progress bar can show a error state. */
    error: PropTypes.bool,

    /** An indicating progress bar visually indicates the current level of progress of a task. */
    indicating: PropTypes.bool,

    /** A progress bar can have its colors inverted. */
    inverted: PropTypes.bool,

    /** Can be set to either to display progress as percent or ratio. */
    label: customPropTypes.itemShorthand,

    /** Current percent complete. */
    percent: customPropTypes.every([
      customPropTypes.disallow(['total', 'value']),
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    ]),

    /** Decimal point precision for calculated progress. */
    precision: PropTypes.number,

    /** A progress bar can contain a text value indicating current progress. */
    progress: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['percent', 'ratio']),
    ]),

    /** A progress bar can vary in size. */
    size: PropTypes.oneOf(_.without(SUI.SIZES, 'mini', 'huge', 'massive')),

    /** A progress bar can show a success state. */
    success: PropTypes.bool,

    /**
     * For use with value.
     * Together, these will calculate the percent.
     * Mutually excludes percent.
     */
    total: customPropTypes.every([
      customPropTypes.demand(['value']),
      customPropTypes.disallow(['percent']),
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    ]),

    /**
     * For use with total. Together, these will calculate the percent. Mutually excludes percent.
     */
    value: customPropTypes.every([
      customPropTypes.demand(['total']),
      customPropTypes.disallow(['percent']),
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    ]),

    /** A progress bar can show a warning state. */
    warning: PropTypes.bool,
  }

  static _meta = {
    name: 'Progress',
    type: META.TYPES.MODULE,
  }

  calculatePercent = () => {
    const { percent, total, value } = this.props

    if (!_.isUndefined(percent)) return percent
    if (!_.isUndefined(total) && !_.isUndefined(value)) return value / total * 100
  }

  getPercent = () => {
    const { precision } = this.props
    const percent = _.clamp(this.calculatePercent(), 0, 100)

    if (_.isUndefined(precision)) return percent
    return _.round(percent, precision)
  }

  isAutoSuccess = () => {
    const { autoSuccess, percent, total, value } = this.props

    return autoSuccess && (percent >= 100 || value >= total)
  }

  renderLabel = () => {
    const { children, label } = this.props

    if (!_.isNil(children)) return <div className='label'>{children}</div>
    return createHTMLDivision(label, { defaultProps: { className: 'label' } })
  }

  renderProgress = percent => {
    const {
      precision,
      progress,
      total,
      value,
    } = this.props

    if (!progress && _.isUndefined(precision)) return
    return (
      <div className='progress'>
        { progress !== 'ratio' ? `${percent}%` : `${value}/${total}` }
      </div>
    )
  }

  render() {
    const {
      active,
      attached,
      className,
      color,
      disabled,
      error,
      indicating,
      inverted,
      size,
      success,
      warning,
    } = this.props

    const classes = cx(
      'ui',
      color,
      size,
      useKeyOnly(active || indicating, 'active'),
      useKeyOnly(disabled, 'disabled'),
      useKeyOnly(error, 'error'),
      useKeyOnly(indicating, 'indicating'),
      useKeyOnly(inverted, 'inverted'),
      useKeyOnly(success || this.isAutoSuccess(), 'success'),
      useKeyOnly(warning, 'warning'),
      useValueAndKey(attached, 'attached'),
      'progress',
      className,
    )
    const rest = getUnhandledProps(Progress, this.props)
    const ElementType = getElementType(Progress, this.props)
    const percent = this.getPercent()

    return (
      <ElementType {...rest} className={classes}>
        <div className='bar' style={{ width: `${percent}%` }}>
          {this.renderProgress(percent)}
        </div>
        {this.renderLabel()}
      </ElementType>
    )
  }
}

export default Progress
