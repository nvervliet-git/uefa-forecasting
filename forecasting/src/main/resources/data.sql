insert into USER(id, email, is_enabled)
values (1, 'nielsvervliet04@hotmail.com', true);

insert into CONFIRMATION_TOKEN(id, token, created_date, user_id)
values (1, '5adf49a7-9e06-4df6-864b-71e6e13c0f82', CURRENT_TIMESTAMP(), 1);
;

alter sequence USER_SEQ restart with 51;
alter sequence CONFIRMATION_TOKEN_SEQ restart with 51;
