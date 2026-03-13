import ProfileForm from "../components/ProfileForm.jsx";

const Profile = () => {
    return (
        <div className="max-w-md max-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Saját adatok</h1>
            <h1 className="text-2xl font-bold mb-4">Saját ticketek</h1>
            <ProfileForm />
        </div>
    )
}

export default Profile;
