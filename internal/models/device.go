package models

import (
    "time"
)

type Device struct {
    ID        uint      `gorm:"primaryKey"`
    UserID    string    `gorm:"not null"`
    Platform  string    `gorm:"not null"`
    Token     string    `gorm:"not null"`
    CreatedAt time.Time
    UpdatedAt time.Time
}