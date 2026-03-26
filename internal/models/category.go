package models

import (
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Category struct {
    ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
    UserID uuid.UUID `gorm:"type:uuid;not null"`
    Name   string    `gorm:"not null"`
}

func (c *Category) BeforeCreate(tx *gorm.DB) (err error) {
    if c.ID == uuid.Nil {
        c.ID = uuid.New()
    }
    return
}
