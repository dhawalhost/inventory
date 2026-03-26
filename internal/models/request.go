package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Request struct {
    ID         uuid.UUID  `gorm:"type:uuid;primaryKey"`
    UserID     uuid.UUID  `gorm:"type:uuid;not null"`
    Name       string     `json:"name" binding:"required"`
    Quantity   int        `json:"quantity" binding:"required"`
    Unit       string     `json:"unit" binding:"required"`
    IsOrdered  bool       `json:"is_ordered" gorm:"default:false"`
    CreatedAt  time.Time
    UpdatedAt  time.Time
}

func (r *Request) BeforeCreate(tx *gorm.DB) (err error) {
    if r.ID == uuid.Nil {
        r.ID = uuid.New()
    }
    return
}
