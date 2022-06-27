;; domain file: bot_vacuum_domain.pddl
(define (domain vacuumcleaningrobot)
    (:requirements :strips)
    (:predicates
        (in-room ?from)
        (door ?from ?to)
        (room_occupied ?r)
        (cleaned ?r)
        (base ?r)
        (high-charge)
        (med-charge)
        (low-charge)
    )
    (:action Move
        :parameters (?from ?to)
        :precondition (and (in-room ?from) (door ?from ?to))
        :effect (and (not (in-room ?from)) (in-room ?to))
    )
    (:action Clean1
        :parameters (?r)
        :precondition (and (in-room ?r) (not (room_occupied ?r)) (high-charge))
        :effect (and (cleaned ?r) (med-charge) (not (high-charge)))
    )
    (:action Clean2
        :parameters (?r)
        :precondition (and (in-room ?r) (not (room_occupied ?r)) (med-charge))
        :effect (and (cleaned ?r) (low-charge) (not (med-charge)))
    )
    (:action Charge
        :parameters (?r)
        :precondition (and (in-room ?r) (base ?r))
        :effect (and (high-charge) (not (low-charge)) (not (med-charge)))
    )
)
