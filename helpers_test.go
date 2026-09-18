package contracts

import "math"

func mathInf() float64 { return math.Inf(1) }
func negZero() float64 { return math.Copysign(0, -1) }
