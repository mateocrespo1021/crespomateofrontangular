export interface Usuario {
    id?:                    number;
    nombre?:                string;
    email?:                 string;
    password?:              string;
    rol?:                   string;
    createdAt?:             Date;
    updatedAt?:             Date;
    enabled?:               boolean;
    accountNonLocked?:      boolean;
    credentialsNonExpired?: boolean;
    accountNonExpired?:     boolean;
    authorities?:           any[];
    username?:              string;
}
