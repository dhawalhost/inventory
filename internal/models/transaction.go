package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Transaction struct {
    ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
    ItemID    uuid.UUID `gorm:"type:uuid;not null"`
    UserID    uuid.UUID `gorm:"type:uuid;not null"`
    Change    int       `gorm:"not null"`
    Reason    string
    Timestamp time.Time
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
    if t.ID == uuid.Nil {
        t.ID = uuid.New()
    }
    return
}
