'use client'
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();

    // If session is loading, you can show a loading indicator
    // if (session === 'loading') {
    //     return <div>Loading...</div>;
    // }

    // If there is no session, you might want to handle that case
    if (!session) {
        return <div>Please log in to view your dashboard.</div>;
    }

    console.log(session)
    // Assuming your session contains the account data
    // const accountData = {
    //     avatarfull: session.picture, // Assuming picture is stored in session
    //     personaname: session.user.name,    // Assuming name is stored in session
    //     steamid: session.id,                // Assuming Steam ID is stored in session
    // };

    return (
        <div className="flex flex-row items-center space-x-6">
            {/* <Image src={accountData.avatarfull} alt="Steam Avatar" width={128} height={128} className="rounded-full" /> */}
            <div className="flex flex-col">
                {/* <div className="mb-2 text-2xl font-bold">{session.user?.name}</div> */}
                {/* <div className="text-xl">{accountData.steamid}</div> */}
            </div>
        </div>
    );

}