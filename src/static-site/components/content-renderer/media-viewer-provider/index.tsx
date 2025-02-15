/**
 * Copyright 2025 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useCallback, useMemo, useState } from "react";

// eslint-disable-next-line import/no-named-as-default
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import { Attachment } from "../../../../confluence-extract";

type MediaViewerContextInfo = {
  openMediaViewer: (fileId: string) => void;
};

const MediaViewerContext = React.createContext<MediaViewerContextInfo>({
  openMediaViewer: (_fileId: string) => () => {},
});

const MediaViewerProvider = ({
  children,
  attachments,
}: {
  children: React.ReactNode;
  attachments: Attachment[];
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const slides = attachments.map((a) => ({
    src: `/attachments/${a.fileId}`,
  }));

  const closeImageViewer = () => {
    setCurrentImageIndex(0);
    setIsViewerOpen(false);
  };

  const openMediaViewer = useCallback((fileId: string) => {
    const index = slides.findIndex((item) => item.src.endsWith(fileId));
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  }, []);

  const value = useMemo(() => {
    return { openMediaViewer };
  }, [openMediaViewer]);
  return (
    <MediaViewerContext.Provider value={value}>
      {children}
      <Lightbox
        open={isViewerOpen}
        close={closeImageViewer}
        slides={slides}
        index={currentImageIndex}
        plugins={[Fullscreen, Zoom]}
      />
    </MediaViewerContext.Provider>
  );
};

const useMediaViewer = () => {
  const context = React.useContext(MediaViewerContext);
  if (context == undefined) {
    throw Error("useMediaViewer must be used within a MediaViewerProvider");
  }
  return context;
};

export { MediaViewerProvider, useMediaViewer };
