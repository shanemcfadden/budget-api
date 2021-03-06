UPDATE transactions
    SET  amount = ?, description = ?, date = ?, account_id = ?
    WHERE id = ?
;