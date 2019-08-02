(module meetup GOVERNANCE

  ;this is where we would define module governance
  ;in this case we are going to keep it simple
  ;can have an owner or tally votes to update the contract
  (defcap GOVERNANCE () true)

  ;defining a simple table schema
  (defschema meetup-schema
    user-guard:guard)

  ;declare the actual table here
  (deftable meetup-table:{meetup-schema})

  (defcap IS-USER (user-id:string)
    (let ((users (keys meetup-table)))
        (enforce (contains user-id users) "you are not a registered user")
    )
  )

  (defun join-meetup (user-id:string)
    (insert meetup-table user-id {
      ;need to remember to include the user's key in the envData
      "user-guard": (read-keyset user-id)
    })
  )

    ;;only let registered members see who is a member
  (defun get-members ()
    ;get the sender of the tx
    (let ((user-id (at "sender" (chain-data))))
        ;is a registered user
        (with-capability (IS-USER user-id)
            (keys meetup-table)
        )
    )
  )

)

(create-table meetup-table)
