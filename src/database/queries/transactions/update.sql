UPDATE transactions
    SET  amount = ?, description = ?, date = ?, account_id = ?, category_id = ?
    WHERE id = ?
;