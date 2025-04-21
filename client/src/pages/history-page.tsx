import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { Loader2, Download, Play, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();

  // Fetch conversions history
  const { data: conversions, isLoading } = useQuery({
    queryKey: ["/api/conversions"],
    enabled: !!user,
  });

  // Fetch files history
  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ["/api/files"],
    enabled: !!user,
  });

  if (isLoading || filesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Conversion History
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion stats */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Your text-to-speech conversion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                      <i className="fas fa-file-alt text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {files?.length || 0}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Files Processed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                      <i className="fas fa-volume-up text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {conversions?.length || 0}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Conversions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                      <i className="fas fa-language text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {
                          new Set(
                            conversions?.map((c: any) => c.language) || []
                          ).size
                        }
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Languages Used
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent conversions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Conversions</CardTitle>
              <CardDescription>
                Your most recent text-to-speech conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!conversions || conversions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="fas fa-file-audio text-4xl mb-3"></i>
                  <p>No conversions yet. Start converting text to speech!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Text</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversions.map((conversion: any) => (
                      <TableRow key={conversion.id}>
                        <TableCell className="font-medium">
                          {conversion.textContent}
                        </TableCell>
                        <TableCell>
                          {conversion.language.toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {formatRelativeTime(new Date(conversion.createdAt))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="icon" variant="ghost">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              asChild
                            >
                              <a href={conversion.audioUrl} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Files History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              All files you've uploaded for text-to-speech conversion
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!files || files.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <i className="fas fa-file-upload text-4xl mb-3"></i>
                <p>You haven't uploaded any files yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {files.map((file: any) => (
                  <div
                    key={file.id}
                    className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                          <i
                            className={`fas fa-file-${
                              file.fileType === "PDF"
                                ? "pdf"
                                : file.fileType === "DOCX"
                                ? "word"
                                : file.fileType === "IMG"
                                ? "image"
                                : "alt"
                            } text-primary-600 dark:text-primary-400`}
                          ></i>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              {file.fileName}
                            </dt>
                            <dd>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {file.fileType} • Uploaded{" "}
                                {formatRelativeTime(new Date(file.uploadDate))}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mr-2"
                        >
                          <i className="fas fa-redo-alt mr-1"></i> Process
                        </Button>
                        <Button size="sm" variant="outline">
                          <i className="fas fa-trash-alt mr-1"></i> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
