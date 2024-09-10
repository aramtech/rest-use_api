import { env } from "../../env.js";

export const use_api = <T, A>(options: {
    login: () => Promise<A>;
}): {
    use: (use: (authentication_props: A) => Promise<T>) => Promise<T>;
} => {
    let login_props: A;
    return {
        use: async (perform) => {
            try {
                if (!login_props) {
                    login_props = await options.login();
                }
                return await perform(login_props);
            } catch (error: any) {
                console.log("Error in use api", error?.response?.data || error?.message, error?.response?.status);
                login_props = await options.login();
                try {
                    return await perform(login_props);
                } catch (error: any) {
                    throw {
                        status_code: error?.response?.status || env.response.status_codes.remote_call_error,
                        error: error,
                    };
                }
            }
        },
    };
};
