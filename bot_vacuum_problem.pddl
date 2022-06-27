;; problem file: bot_vacuum_problem.pddl
(define (problem housecleaning)
    (:domain vacuumcleaningrobot)
    (:objects kitchen bedroom livingroom)
    (:init 
        (in-room livingroom)
        (base livingroom)
        (high-charge)
        (door livingroom kitchen)
        (door kitchen livingroom)
        (door livingroom bedroom)
        (door bedroom livingroom)
    )
    (:goal 
        (and 
        (cleaned livingroom)
        (cleaned kitchen)
        (cleaned bedroom)
        (high-charge)
        )
    )
)
