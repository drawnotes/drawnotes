import {
  AlertFillIcon,
  AlertIcon,
  ArchiveIcon,
  ArrowBothIcon,
  ArrowDownIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSwitchIcon,
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  BeakerIcon,
  BellFillIcon,
  BellIcon,
  BellSlashIcon,
  BlockedIcon,
  BoldIcon,
  BookIcon,
  BookmarkFillIcon,
  BookmarkIcon,
  BookmarkSlashFillIcon,
  BookmarkSlashIcon,
  BriefcaseIcon,
  BroadcastIcon,
  BrowserIcon,
  BugIcon,
  CalendarIcon,
  CheckCircleFillIcon,
  CheckCircleIcon,
  CheckIcon,
  ChecklistIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleIcon,
  CircleSlashIcon,
  ClockIcon,
  CodeIcon,
  CodeOfConductIcon,
  CodeReviewIcon,
  CodescanCheckmarkIcon,
  CodescanIcon,
  CodespacesIcon,
  CodeSquareIcon,
  ColumnsIcon,
  CommentDiscussionIcon,
  CommentIcon,
  CommitIcon,
  ContainerIcon,
  CopyIcon,
  CpuIcon,
  CreditCardIcon,
  CrossReferenceIcon,
  DashIcon,
  DatabaseIcon,
  DependabotIcon,
  DesktopDownloadIcon,
  DeviceCameraIcon,
  DeviceCameraVideoIcon,
  DeviceDesktopIcon,
  DeviceMobileIcon,
  DiamondIcon,
  DiffAddedIcon,
  DiffIcon,
  DiffIgnoredIcon,
  DiffModifiedIcon,
  DiffRemovedIcon,
  DiffRenamedIcon,
  DotFillIcon,
  DotIcon,
  DownloadIcon,
  DuplicateIcon,
  EllipsisIcon,
  EyeClosedIcon,
  EyeIcon,
  FileBadgeIcon,
  FileBinaryIcon,
  FileCodeIcon,
  FileDiffIcon,
  FileDirectoryFillIcon,
  FileDirectoryIcon,
  FileIcon,
  FileMediaIcon,
  FileSubmoduleIcon,
  FileSymlinkFileIcon,
  FileZipIcon,
  FilterIcon,
  FlameIcon,
  FoldDownIcon,
  FoldIcon,
  FoldUpIcon,
  GearIcon,
  GiftIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitCompareIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  GitPullRequestIcon,
  GlobeIcon,
  GrabberIcon,
  GraphIcon,
  HashIcon,
  HeadingIcon,
  HeartFillIcon,
  HeartIcon,
  HistoryIcon,
  HomeFillIcon,
  HomeIcon,
  HorizontalRuleIcon,
  HourglassIcon,
  HubotIcon,
  ImageIcon,
  InboxIcon,
  InfinityIcon,
  InfoIcon,
  IssueClosedIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  ItalicIcon,
  IterationsIcon,
  KebabHorizontalIcon,
  KeyAsteriskIcon,
  KeyIcon,
  LawIcon,
  LightBulbIcon,
  LinkExternalIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  LocationIcon,
  LockIcon,
  LogoGistIcon,
  LogoGithubIcon,
  MailIcon,
  MarkdownIcon,
  MarkGithubIcon,
  MegaphoneIcon,
  MentionIcon,
  MeterIcon,
  MilestoneIcon,
  MirrorIcon,
  MoonIcon,
  MortarBoardIcon,
  MultiSelectIcon,
  MuteIcon,
  NoEntryFillIcon,
  NoEntryIcon,
  NorthStarIcon,
  NoteIcon,
  NumberIcon,
  OrganizationIcon,
  PackageDependenciesIcon,
  PackageDependentsIcon,
  PackageIcon,
  PaintbrushIcon,
  PaperAirplaneIcon,
  PasteIcon,
  PencilIcon,
  PeopleIcon,
  PersonAddIcon,
  PersonFillIcon,
  PersonIcon,
  PinIcon,
  PlayIcon,
  PlugIcon,
  PlusCircleIcon,
  PlusIcon,
  ProjectIcon,
  PulseIcon,
  QuestionIcon,
  QuoteIcon,
  ReplyIcon,
  RepoCloneIcon,
  RepoForkedIcon,
  RepoIcon,
  RepoPullIcon,
  RepoPushIcon,
  ReportIcon,
  RepoTemplateIcon,
  RocketIcon,
  RowsIcon,
  RssIcon,
  RubyIcon,
  ScreenFullIcon,
  ScreenNormalIcon,
  SearchIcon,
  ServerIcon,
  ShareAndroidIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldLockIcon,
  ShieldXIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  SignInIcon,
  SignOutIcon,
  SingleSelectIcon,
  SkipIcon,
  SmileyIcon,
  SortAscIcon,
  SortDescIcon,
  SquareFillIcon,
  SquareIcon,
  SquirrelIcon,
  StackIcon,
  StarFillIcon,
  StarIcon,
  StopIcon,
  StopwatchIcon,
  StrikethroughIcon,
  SunIcon,
  SyncIcon,
  TabIcon,
  TableIcon,
  TagIcon,
  TasklistIcon,
  TelescopeFillIcon,
  TelescopeIcon,
  TerminalIcon,
  ThreeBarsIcon,
  ThumbsdownIcon,
  ThumbsupIcon,
  ToolsIcon,
  TrashIcon,
  TriangleDownIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
  TriangleUpIcon,
  TypographyIcon,
  UnfoldIcon,
  UnlockIcon,
  UnmuteIcon,
  UnverifiedIcon,
  UploadIcon,
  VerifiedIcon,
  VersionsIcon,
  VideoIcon,
  WorkflowIcon,
  XCircleFillIcon,
  XCircleIcon,
  XIcon,
  ZapIcon,
} from "@primer/octicons-react";
import { Box, Link, StyledOcticon, TextInput, Tooltip } from "@primer/react";
import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";

interface Props {}

const Icons: NextPage<Props> = ({}) => {
  const icons = [
    AlertIcon,
    AlertFillIcon,
    ArchiveIcon,
    ArrowBothIcon,
    ArrowDownIcon,
    ArrowDownLeftIcon,
    ArrowDownRightIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowSwitchIcon,
    ArrowUpIcon,
    ArrowUpLeftIcon,
    ArrowUpRightIcon,
    BeakerIcon,
    BellIcon,
    BellFillIcon,
    BellSlashIcon,
    BlockedIcon,
    BoldIcon,
    BookIcon,
    BookmarkIcon,
    BookmarkFillIcon,
    BookmarkSlashIcon,
    BookmarkSlashFillIcon,
    BriefcaseIcon,
    BroadcastIcon,
    BrowserIcon,
    BugIcon,
    CalendarIcon,
    CheckIcon,
    CheckCircleIcon,
    CheckCircleFillIcon,
    ChecklistIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CircleIcon,
    CircleSlashIcon,
    ClockIcon,
    CodeIcon,
    CodeOfConductIcon,
    CodeReviewIcon,
    CodeSquareIcon,
    CodescanIcon,
    CodescanCheckmarkIcon,
    CodespacesIcon,
    ColumnsIcon,
    CommentIcon,
    CommentDiscussionIcon,
    CommitIcon,
    ContainerIcon,
    CopyIcon,
    CpuIcon,
    CreditCardIcon,
    CrossReferenceIcon,
    DashIcon,
    DatabaseIcon,
    DependabotIcon,
    DesktopDownloadIcon,
    DeviceCameraIcon,
    DeviceCameraVideoIcon,
    DeviceDesktopIcon,
    DeviceMobileIcon,
    DiamondIcon,
    DiffIcon,
    DiffAddedIcon,
    DiffIgnoredIcon,
    DiffModifiedIcon,
    DiffRemovedIcon,
    DiffRenamedIcon,
    DotIcon,
    DotFillIcon,
    DownloadIcon,
    DuplicateIcon,
    EllipsisIcon,
    EyeIcon,
    EyeClosedIcon,
    FileIcon,
    FileBadgeIcon,
    FileBinaryIcon,
    FileCodeIcon,
    FileDiffIcon,
    FileDirectoryIcon,
    FileDirectoryFillIcon,
    FileMediaIcon,
    FileSubmoduleIcon,
    FileSymlinkFileIcon,
    FileZipIcon,
    FilterIcon,
    FlameIcon,
    FoldIcon,
    FoldDownIcon,
    FoldUpIcon,
    GearIcon,
    GiftIcon,
    GitBranchIcon,
    GitCommitIcon,
    GitCompareIcon,
    GitMergeIcon,
    GitPullRequestIcon,
    GitPullRequestClosedIcon,
    GitPullRequestDraftIcon,
    GlobeIcon,
    GrabberIcon,
    GraphIcon,
    HashIcon,
    HeadingIcon,
    HeartIcon,
    HeartFillIcon,
    HistoryIcon,
    HomeIcon,
    HomeFillIcon,
    HorizontalRuleIcon,
    HourglassIcon,
    HubotIcon,
    ImageIcon,
    InboxIcon,
    InfinityIcon,
    InfoIcon,
    IssueClosedIcon,
    IssueDraftIcon,
    IssueOpenedIcon,
    IssueReopenedIcon,
    ItalicIcon,
    IterationsIcon,
    KebabHorizontalIcon,
    KeyIcon,
    KeyAsteriskIcon,
    LawIcon,
    LightBulbIcon,
    LinkIcon,
    LinkExternalIcon,
    ListOrderedIcon,
    ListUnorderedIcon,
    LocationIcon,
    LockIcon,
    LogoGistIcon,
    LogoGithubIcon,
    MailIcon,
    MarkGithubIcon,
    MarkdownIcon,
    MegaphoneIcon,
    MentionIcon,
    MeterIcon,
    MilestoneIcon,
    MirrorIcon,
    MoonIcon,
    MortarBoardIcon,
    MultiSelectIcon,
    MuteIcon,
    NoEntryIcon,
    NoEntryFillIcon,
    NorthStarIcon,
    NoteIcon,
    NumberIcon,
    OrganizationIcon,
    PackageIcon,
    PackageDependenciesIcon,
    PackageDependentsIcon,
    PaintbrushIcon,
    PaperAirplaneIcon,
    PasteIcon,
    PencilIcon,
    PeopleIcon,
    PersonIcon,
    PersonAddIcon,
    PersonFillIcon,
    PinIcon,
    PlayIcon,
    PlugIcon,
    PlusIcon,
    PlusCircleIcon,
    ProjectIcon,
    PulseIcon,
    QuestionIcon,
    QuoteIcon,
    ReplyIcon,
    RepoIcon,
    RepoCloneIcon,
    RepoForkedIcon,
    RepoPullIcon,
    RepoPushIcon,
    RepoTemplateIcon,
    ReportIcon,
    RocketIcon,
    RowsIcon,
    RssIcon,
    RubyIcon,
    ScreenFullIcon,
    ScreenNormalIcon,
    SearchIcon,
    ServerIcon,
    ShareIcon,
    ShareAndroidIcon,
    ShieldIcon,
    ShieldCheckIcon,
    ShieldLockIcon,
    ShieldXIcon,
    SidebarCollapseIcon,
    SidebarExpandIcon,
    SignInIcon,
    SignOutIcon,
    SingleSelectIcon,
    SkipIcon,
    SmileyIcon,
    SortAscIcon,
    SortDescIcon,
    SquareIcon,
    SquareFillIcon,
    SquirrelIcon,
    StackIcon,
    StarIcon,
    StarFillIcon,
    StopIcon,
    StopwatchIcon,
    StrikethroughIcon,
    SunIcon,
    SyncIcon,
    TabIcon,
    TableIcon,
    TagIcon,
    TasklistIcon,
    TelescopeIcon,
    TelescopeFillIcon,
    TerminalIcon,
    ThreeBarsIcon,
    ThumbsdownIcon,
    ThumbsupIcon,
    ToolsIcon,
    TrashIcon,
    TriangleDownIcon,
    TriangleLeftIcon,
    TriangleRightIcon,
    TriangleUpIcon,
    TypographyIcon,
    UnfoldIcon,
    UnlockIcon,
    UnmuteIcon,
    UnverifiedIcon,
    UploadIcon,
    VerifiedIcon,
    VersionsIcon,
    VideoIcon,
    WorkflowIcon,
    XIcon,
    XCircleIcon,
    XCircleFillIcon,
    ZapIcon,
  ];
  const [value, setValue] = useState<string>("");
  const filteredIcons = value
    ? icons.filter((icon) => icon.name.toLowerCase().includes(value))
    : icons;

  const handleChange = (event: FormEvent<HTMLInputElement>) =>
    setValue(event.currentTarget.value);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      color="fg.default"
      bg="canvas.default"
    >
      <ColorModeSwitcher />
      <Box mt={10}>
        <Link href="/">Home</Link>
      </Box>
      <Box mt={4}>
        <TextInput
          aria-label="search"
          name="search"
          placeholder="search"
          autoComplete="off"
          onChange={handleChange}
        />
      </Box>
      <Box m={3}>{icons.length} Icons</Box>
      <Box display="grid" gridTemplateColumns="repeat(20, auto)" gridGap={3}>
        {filteredIcons.map((icon, index) => (
          <Box key={index} m={2}>
            <Tooltip aria-label={icon.name}>
              <StyledOcticon icon={icon} size={30} />
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Icons;
