package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Item struct {
    ID         uuid.UUID  `gorm:"type:uuid;primaryKey"`
    UserID     uuid.UUID  `gorm:"type:uuid;not null"`
    CategoryID *uuid.UUID `gorm:"type:uuid"`
    Name       string     `gorm:"not null"`
    Quantity   int        `gorm:"not null"`
    Unit       string     `gorm:"not null"`
    ExpiryDate *time.Time
    Notes      string
    CreatedAt  time.Time
    UpdatedAt  time.Time
}

func (i *Item) BeforeCreate(tx *gorm.DB) (err error) {
    if i.ID == uuid.Nil {
        i.ID = uuid.New()
    }
    return
}
