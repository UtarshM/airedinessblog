import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Integration {
    id: string;
    platform: string;
    credentials: {
        url?: string;
        username?: string;
        app_password?: string;
        auto_publish?: boolean;
    };
    is_active: boolean;
    created_at: string;
}

const IntegrationsPage = () => {
    const { user } = useAuth();
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [url, setUrl] = useState("");
    const [username, setUsername] = useState("");
    const [appPassword, setAppPassword] = useState("");
    const [autoPublish, setAutoPublish] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchIntegrations = async () => {
        if (!user) return;
        setLoading(true);
        // Use 'as any' to bypass strict typing for the new table
        const { data, error } = await (supabase
            .from("workspace_integrations" as any)
            .select("*")
            .eq("user_id", user.id)
            .eq("platform", "wordpress") as any);

        if (error) {
            toast.error("Failed to load integrations");
        } else {
            setIntegrations((data as Integration[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchIntegrations();
    }, [user]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !username || !appPassword) {
            toast.error("Please fill all fields");
            return;
        }

        setIsAdding(true);
        try {
            // 1. Prepare clean URL
            let cleanUrl = url.trim();
            if (cleanUrl.endsWith("/")) cleanUrl = cleanUrl.slice(0, -1);

            // 2. Test WordPress Credentials
            const authString = btoa(`${username.trim()}:${appPassword.trim()}`);
            const testResponse = await fetch(`${cleanUrl}/wp-json/wp/v2/users/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${authString}`,
                    "Content-Type": "application/json"
                }
            });

            if (!testResponse.ok) {
                if (testResponse.status === 401) {
                    throw new Error("Invalid Username or Application Password.");
                } else if (testResponse.status === 404) {
                    throw new Error("WordPress REST API not found at this URL. Make sure it's a valid WordPress site.");
                } else {
                    throw new Error(`WordPress returned an error: ${testResponse.status} ${testResponse.statusText}`);
                }
            }

            // 3. If validation successful, save to Supabase
            const { error } = await supabase
                .from("workspace_integrations" as any)
                .insert({
                    user_id: user!.id,
                    platform: "wordpress",
                    credentials: { url: cleanUrl, username: username.trim(), app_password: appPassword.trim(), auto_publish: autoPublish },
                    is_active: true
                });

            if (error) throw error;

            toast.success("WordPress connected successfully!");
            setDialogOpen(false);
            setUrl("");
            setUsername("");
            setAppPassword("");
            setAutoPublish(false);
            fetchIntegrations();
        } catch (err: any) {
            toast.error(err.message || "Failed to add integration");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this integration?")) return;
        const { error } = await supabase
            .from("workspace_integrations" as any)
            .delete()
            .eq("id", id);

        if (error) toast.error("Failed to delete");
        else {
            toast.success("Deleted");
            fetchIntegrations();
        }
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Integrations</h1>
                    <p className="text-muted-foreground">Manage your external connections</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add WordPress
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Connect WordPress</DialogTitle>
                            <DialogDescription>
                                Use an Application Password, not your login password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <Label htmlFor="url">Site URL</Label>
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://mysite.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                />
                            </div>
                            <div>
                                <Label htmlFor="appPassword">Application Password</Label>
                                <Input
                                    id="appPassword"
                                    type="password"
                                    value={appPassword}
                                    onChange={(e) => setAppPassword(e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Go to Users &gt; Profile &gt; Application Passwords in WordPress admin.
                                </p>
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label>Auto-Publish</Label>
                                    <p className="text-xs text-muted-foreground">Automatically publish generated content to WordPress.</p>
                                </div>
                                <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Connect
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {integrations.length === 0 && (
                        <div className="col-span-full text-center py-12 border rounded-lg border-dashed text-muted-foreground">
                            No integrations found. Add one to start publishing.
                        </div>
                    )}
                    {integrations.map((integration) => (
                        <Card key={integration.id}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    WordPress
                                    {integration.is_active ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    {integration.credentials.url}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><span className="font-medium">User:</span> {integration.credentials.username}</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Auto-Publish:</span>
                                    {integration.credentials.auto_publish ? (
                                        <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-0">Enabled</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground bg-muted border-0">Disabled</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground pt-1">Added on {new Date(integration.created_at).toLocaleDateString()}</p>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(integration.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IntegrationsPage;
