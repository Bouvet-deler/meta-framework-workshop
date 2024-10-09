import ClientComponent from "./clientComponent";
import ServerComponent from "./serverComponent";

export default function Demo2 () {
  return (
    <div >
        <h1>
            Demo 2
        </h1>
        <p>Server and client components intertwined!</p>
        <ServerComponent>
            <ClientComponent>
                <ServerComponent>
                    <ClientComponent></ClientComponent>
                </ServerComponent>
            </ClientComponent>
        </ServerComponent>
    </div>
  );
}