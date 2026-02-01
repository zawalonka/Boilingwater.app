/**
 * RoomControls Component
 * 
 * UI controls for AC unit and air handler.
 * Only visible when experiment has unlocksRoomControls: true (L1E4+)
 */

import React from 'react'
import { getAcStatus } from '../utils/acUnitHandler'
import '../styles/RoomControls.css'

function RoomControls({
  enabled,
  summary,
  alerts,
  // Current equipment
  acUnit,
  airHandler,
  // Available equipment lists
  availableAcUnits,
  availableAirHandlers,
  // Current selections
  selectedAcUnitId,
  selectedAirHandlerId,
  // Callbacks
  onAcEnabledChange,
  onAcSetpointChange,
  onAirHandlerModeChange,
  onAcUnitChange,
  onAirHandlerChange
}) {
  if (!enabled) return null

  const acStatus = getAcStatus(summary?.acStatus, acUnit)

  return (
    <div className="room-controls">
      <div className="room-controls-header">
        <span className="room-controls-title">🏠 Room Environment</span>
        {alerts?.length > 0 && (
          <span className={`room-alert-badge ${alerts[0].severity}`}>
            ⚠ {alerts.length}
          </span>
        )}
      </div>

      {/* Room Status Display */}
      <div className="room-status">
        <div className="room-stat">
          <span className="stat-label">Room Temp</span>
          <span className="stat-value">{summary?.temperature ?? 20}°C</span>
        </div>
        <div className="room-stat">
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{summary?.pressureKPa ?? 101.3} kPa</span>
        </div>
        <div className="room-stat">
          <span className="stat-label">O₂</span>
          <span className={`stat-value ${(summary?.o2Percent ?? 21) < 19.5 ? 'warning' : ''}`}>
            {summary?.o2Percent ?? 21}%
          </span>
        </div>
        <div className="room-stat">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{summary?.humidity ?? 1}%</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts?.length > 0 && (
        <div className="room-alerts">
          {alerts.map((alert, i) => (
            <div key={i} className={`room-alert ${alert.severity}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* AC Unit Selection */}
      {availableAcUnits?.length > 1 && (
        <div className="room-control-group">
          <label className="control-label">
            <span>🌡️ AC Unit</span>
          </label>
          <select
            className="equipment-select"
            value={selectedAcUnitId || ''}
            onChange={(e) => onAcUnitChange?.(e.target.value)}
          >
            {availableAcUnits.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {/* AC On/Off Toggle */}
      <div className="room-control-group">
        <label className="control-label">
          <span>❄️ AC Unit</span>
        </label>
        <div 
          className={`ac-toggle ${summary?.acEnabled ? 'active' : ''}`}
          onClick={() => onAcEnabledChange?.(!summary?.acEnabled)}
          style={{ cursor: acUnit ? 'pointer' : 'not-allowed', opacity: acUnit ? 1 : 0.5 }}
        >
          <span className="toggle-label">Climate Control</span>
          <span className={`toggle-status ${summary?.acEnabled ? 'on' : 'off'}`}>
            {summary?.acEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* AC Setpoint Controls (only when AC enabled) */}
      {summary?.acEnabled && (
        <div className="room-control-group">
          <label className="control-label">
            <span>🎯 AC Setpoint</span>
            <span className="control-status">{acStatus}</span>
          </label>
          <div className="ac-setpoint-control">
            <button 
              className="setpoint-btn"
              onClick={() => onAcSetpointChange?.((summary?.acSetpoint ?? 20) - 1)}
              disabled={!acUnit}
            >
              −
            </button>
            <span className="setpoint-value">
              {Math.round(summary?.acSetpoint ?? 20)}°C
            </span>
            <button 
              className="setpoint-btn"
              onClick={() => onAcSetpointChange?.((summary?.acSetpoint ?? 20) + 1)}
              disabled={!acUnit}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Air Handler Selection */}
      {availableAirHandlers?.length > 1 && (
        <div className="room-control-group">
          <label className="control-label">
            <span>💨 Air Handler</span>
          </label>
          <select
            className="equipment-select"
            value={selectedAirHandlerId || ''}
            onChange={(e) => onAirHandlerChange?.(e.target.value)}
          >
            {availableAirHandlers.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {/* Air Handler On/Off Toggle */}
      <div className="room-control-group">
        <label className="control-label">
          <span>🔄 Scrubber</span>
        </label>
        <div 
          className={`air-handler-toggle ${summary?.airHandlerMode !== 'off' ? 'active' : ''}`}
          onClick={() => onAirHandlerModeChange?.(summary?.airHandlerMode === 'off' ? 'on' : 'off')}
          style={{ cursor: airHandler ? 'pointer' : 'not-allowed', opacity: airHandler ? 1 : 0.5 }}
        >
          <span className="toggle-label">Auto-Scrub</span>
          <span className={`toggle-status ${summary?.airHandlerMode !== 'off' ? 'on' : 'off'}`}>
            {summary?.airHandlerMode !== 'off' ? 'ON' : 'OFF'}
          </span>
        </div>
        {summary?.airHandlerMode !== 'off' && (summary?.scrubberActivity ?? 0) > 0 && (
          <div className="air-handler-activity">
            Working at {Math.round((summary?.scrubberActivity ?? 0) * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomControls
