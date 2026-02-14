// Account Entity Types

/**
 * Icon names for account menu
 */
export type IconName = 'address' | 'orderHistory' | 'logout' | 'user';

/**
 * User account profile
 */
export interface AccountProfile {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    phone: string;
    birthDate?: string;
}

/**
 * Complete account data
 */
export interface AccountData {
    profile: AccountProfile;
}
