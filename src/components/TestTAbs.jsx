"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TestTabs() {
    return (
        <Tabs defaultValue="one" className="w-full max-w-md mx-auto mt-10">
            <TabsList>
                <TabsTrigger value="one">One</TabsTrigger>
                <TabsTrigger value="two">Two</TabsTrigger>
                <TabsTrigger value="three">Three</TabsTrigger>
            </TabsList>
            <TabsContent value="one">Tab One Content</TabsContent>
            <TabsContent value="two">Tab Two Content</TabsContent>
            <TabsContent value="three">Tab Three Content</TabsContent>
        </Tabs>
    );
}
